const { NotFoundError, ConflictError } = require("../../../common/exceptions");
const { runTransaction } = require("../../../common/prisma/transaction");
const tagRepository = require("../repository/tag.repository");
const { TagMapper } = require("../mapper/tag.mapper");
const { TagDto } = require("../dto/tag.dto");
const { TAG_MESSAGES } = require("../constants/tag-message.constants");
const { TAG_ERRORS } = require("../constants/tag-error.constants");
const logger = require("../../../config/logger");

/**
 * ==========================================================
 * Enterprise Update Tag Service
 * ==========================================================
 * Handles tag property updates with duplicate name checking & transactions.
 * ==========================================================
 */
class UpdateTagService {
  async execute(id, payload, userId) {
    logger.info({ id, userId, name: payload.name }, "Initiating tag update");

    // 1. Verify existence
    const existing = await tagRepository.findById(id);
    if (!existing) {
      logger.warn({ id }, "Tag not found for update");
      throw new NotFoundError(
        "Question tag not found.",
        TAG_ERRORS.NOT_FOUND
      );
    }

    // 2. Duplicate check if name is being changed
    if (payload.name && payload.name.trim().toLowerCase() !== existing.name.toLowerCase()) {
      const duplicate = await tagRepository.findByName(payload.name.trim());
      if (duplicate && duplicate.id !== id) {
        logger.warn({ id, newName: payload.name }, "Duplicate tag name detected during update");
        throw new ConflictError(
          "A tag with this name already exists.",
          TAG_ERRORS.ALREADY_EXISTS
        );
      }
    }

    // 3. Execute Transaction Update
    const updatedTag = await runTransaction(async (tx) => {
      const updateData = TagMapper.toUpdateEntity(payload, userId);
      return tagRepository.update(tx, id, updateData);
    });

    logger.info({ id, name: updatedTag.name }, "Tag updated successfully");

    return {
      message: TAG_MESSAGES.UPDATED,
      data: TagDto.toResponse(updatedTag),
    };
  }
}

const updateTagService = new UpdateTagService();

module.exports = updateTagService;
