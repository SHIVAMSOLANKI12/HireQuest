const categoryRepository = require("../repository/category.repository");
const { CategoryDto } = require("../dto/category.dto");
const { CATEGORY_MESSAGES } = require("../constants/category-message.constants");
const logger = require("../../../config/logger");

/**
 * ==========================================================
 * Enterprise List Categories Service
 * ==========================================================
 * Retrieves paginated, searched, sorted, and filtered category records.
 * ==========================================================
 */
class GetCategoriesService {
  async execute(queryParams = {}) {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const search = queryParams.search || "";
    const sortBy = queryParams.sortBy || "createdAt";
    const sortOrder = queryParams.sortOrder || "desc";
    const isActive = queryParams.isActive !== undefined ? queryParams.isActive : "true";

    logger.info({ page, limit, search, sortBy, sortOrder, isActive }, "Fetching categories list");

    const result = await categoryRepository.listPaginated({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      isActive,
    });

    const items = result.data.map((cat) => CategoryDto.toAdminListResponse(cat));

    return {
      message: CATEGORY_MESSAGES.LIST_FETCHED,
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

const getCategoriesService = new GetCategoriesService();

module.exports = getCategoriesService;
