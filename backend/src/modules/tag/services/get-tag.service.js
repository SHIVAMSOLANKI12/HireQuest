const { NotFoundError } = require("../../../common/exceptions");
const tagRepository = require("../repository/tag.repository");
const { TagDto } = require("../dto/tag.dto");
const { TAG_MESSAGES } = require("../constants/tag-message.constants");
const { TAG_ERRORS } = require("../constants/tag-error.constants");
const logger = require("../../../config/logger");

/**
 * ==========================================================
 * Enterprise Get Tag By ID Service
 * ==========================================================
 * Fetches a single tag record by unique ID.
 * ==========================================================
 */
class GetTagService {
  async execute(id) {
    logger.info({ id }, "Fetching tag by ID");

    const tag = await tagRepository.findById(id);

    if (!tag) {
      logger.warn({ id }, "Tag not found");
      throw new NotFoundError(
        "Question tag not found.",
        TAG_ERRORS.NOT_FOUND
      );
    }

    return {
      message: TAG_MESSAGES.FETCHED,
      data: TagDto.toResponse(tag),
    };
  }
}

const getTagService = new GetTagService();

module.exports = getTagService;
