const { NotFoundError, BadRequestError } = require("../../../common/exceptions");
const { runTransaction } = require("../../../common/prisma/transaction");
const tagRepository = require("../repository/tag.repository");
const { TagDto } = require("../dto/tag.dto");
const { TAG_MESSAGES } = require("../constants/tag-message.constants");
const { TAG_ERRORS } = require("../constants/tag-error.constants");
const logger = require("../../../config/logger");

/**
 * ==========================================================
 * Enterprise Restore Tag Service
 * ==========================================================
 * Restores a soft-deleted tag by setting isActive: true.
 * ==========================================================
 */
class RestoreTagService {
  async execute(id, userId) {
    logger.info({ id, userId }, "Initiating tag restoration");

    const existing = await tagRepository.findById(id);
    if (!existing) {
      logger.warn({ id }, "Tag not found for restoration");
      throw new NotFoundError(
        "Question tag not found.",
        TAG_ERRORS.NOT_FOUND
      );
    }

    if (existing.isActive) {
      logger.warn({ id }, "Tag is already active");
      throw new BadRequestError(
        "Tag is already active.",
        TAG_ERRORS.ALREADY_ACTIVE
      );
    }

    const restoredTag = await runTransaction(async (tx) => {
      return tagRepository.restore(tx, id);
    });

    logger.info({ id }, "Tag restored successfully");

    return {
      message: TAG_MESSAGES.RESTORED,
      data: TagDto.toResponse(restoredTag),
    };
  }
}

const restoreTagService = new RestoreTagService();

module.exports = restoreTagService;
