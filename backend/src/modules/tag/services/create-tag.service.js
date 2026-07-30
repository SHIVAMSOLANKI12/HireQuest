const { ConflictError } = require("../../../common/exceptions");
const { runTransaction } = require("../../../common/prisma/transaction");
const logger = require("../../../config/logger");

const tagRepository = require("../repository/tag.repository");
const { TagMapper } = require("../mapper/tag.mapper");
const { TagDto } = require("../dto/tag.dto");
const { TAG_MESSAGES } = require("../constants/tag-message.constants");
const { TAG_ERRORS } = require("../constants/tag-error.constants");

/**
 * ==========================================================
 * Enterprise Create Tag Service
 * ==========================================================
 * Handles case-insensitive duplicate detection, ACID transaction execution,
 * tag creation, audit logging, and client-safe DTO response formatting.
 * ==========================================================
 */
class CreateTagService {
  async execute(payload, userId) {
    const name = payload.name.trim();
    logger.info({ userId, name }, "Initiating tag creation");

    /**
     * 1. Case-Insensitive Duplicate Check
     */
    const existingTag = await tagRepository.findByName(name);

    if (existingTag) {
      logger.warn({ name }, "Duplicate tag name detected");
      throw new ConflictError(
        "Tag with this name already exists.",
        TAG_ERRORS.ALREADY_EXISTS
      );
    }

    /**
     * 2. ACID Database Transaction Execution
     */
    const createdTag = await runTransaction(async (tx) => {
      const tagData = TagMapper.toCreateEntity(payload, userId);
      return tagRepository.create(tx, tagData);
    });

    logger.info({ tagId: createdTag.id, name: createdTag.name }, "Tag created successfully");

    /**
     * 3. Format and Return Client-Safe Response DTO
     */
    return {
      message: TAG_MESSAGES.CREATED,
      data: TagDto.toResponse(createdTag),
    };
  }
}

const createTagService = new CreateTagService();

module.exports = createTagService;
