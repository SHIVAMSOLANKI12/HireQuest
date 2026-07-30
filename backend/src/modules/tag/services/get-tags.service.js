const tagRepository = require("../repository/tag.repository");
const { TagDto } = require("../dto/tag.dto");
const { TAG_MESSAGES } = require("../constants/tag-message.constants");
const logger = require("../../../config/logger");

/**
 * ==========================================================
 * Enterprise List Tags Service
 * ==========================================================
 * Retrieves paginated, searched, sorted, and filtered tag records.
 * ==========================================================
 */
class GetTagsService {
  async execute(queryParams = {}) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const search = queryParams.search || "";
    const sortBy = queryParams.sortBy || "createdAt";
    const sortOrder = queryParams.sortOrder || "desc";
    const isActive = queryParams.isActive !== undefined ? queryParams.isActive : "true";

    logger.info({ page, limit, search, sortBy, sortOrder, isActive }, "Fetching tags list");

    const result = await tagRepository.listPaginated({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      isActive,
    });

    const items = result.data.map((tag) => TagDto.toAdminListResponse(tag));

    return {
      message: TAG_MESSAGES.LIST_FETCHED,
      data: items,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit) || 1,
      },
    };
  }
}

const getTagsService = new GetTagsService();

module.exports = getTagsService;
