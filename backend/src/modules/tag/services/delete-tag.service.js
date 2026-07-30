const { NotFoundError, ConflictError, BadRequestError } = require("../../../common/exceptions");
const { runTransaction } = require("../../../common/prisma/transaction");
const tagRepository = require("../repository/tag.repository");
const { TagDto } = require("../dto/tag.dto");
const { TAG_MESSAGES } = require("../constants/tag-message.constants");
const { TAG_ERRORS } = require("../constants/tag-error.constants");
const logger = require("../../../config/logger");

/**
 * ==========================================================
 * Enterprise Soft Delete Tag Service
 * ==========================================================
 * Verifies tag exists, checks for active question associations,
 * and sets isActive: false within an ACID transaction.
 * ==========================================================
 */
class DeleteTagService {
  async execute(id, userId) {
    logger.info({ id, userId }, "Initiating tag soft deletion");

    // 1. Check existence
    const existing = await tagRepository.findById(id);
    if (!existing) {
      logger.warn({ id }, "Tag not found for soft deletion");
      throw new NotFoundError(
        "Question tag not found.",
        TAG_ERRORS.NOT_FOUND
      );
    }

    // 2. Prevent deletion if already inactive
    if (!existing.isActive) {
      logger.warn({ id }, "Tag is already deleted/inactive");
      throw new BadRequestError(
        "Tag is already deleted.",
        "TAG_ALREADY_DELETED"
      );
    }

    // 3. Verify no active associated questions
    const questionCount = await tagRepository.countAssociatedQuestions(id);
    if (questionCount > 0) {
      logger.warn({ id, questionCount }, "Cannot delete tag with associated active questions");
      throw new ConflictError(
        "Cannot delete tag as it is currently associated with active questions.",
        TAG_ERRORS.IN_USE
      );
    }

    // 4. Soft delete transaction
    const deletedTag = await runTransaction(async (tx) => {
      return tagRepository.softDelete(tx, id);
    });

    logger.info({ id }, "Tag soft-deleted successfully");

    return {
      message: TAG_MESSAGES.DELETED,
      data: TagDto.toResponse(deletedTag),
    };
  }
}

const deleteTagService = new DeleteTagService();

module.exports = deleteTagService;
