const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("../../common/middlewares/async-handler");
const { SuccessResponse } = require("../../common/response");
const { CATEGORY_MESSAGES } = require("./constants/category-message.constants");
const categoryService = require("./category.service");

/**
 * ==========================================================
 * Enterprise Category Controller
 * ==========================================================
 * Express HTTP handlers for Category module endpoints.
 * Uses req.validatedData and delegates 100% to Category service.
 * ==========================================================
 */
class CategoryController {
  /**
   * Create Category Handler
   * POST /api/v1/question-categories
   */
  create = asyncHandler(async (req, res) => {
    const payload = req.validatedData || req.body;
    const userId = req.user.id;

    const result = await categoryService.createCategory(payload, userId);

    return SuccessResponse.send(
      res,
      {
        message: result.message || CATEGORY_MESSAGES.CREATED,
        data: result.data,
      },
      StatusCodes.CREATED
    );
  });

  /**
   * List Categories Handler (Paginated, Filtered, Sorted, Searched)
   * GET /api/v1/question-categories
   */
  list = asyncHandler(async (req, res) => {
    const query = req.validatedData || req.query;

    const result = await categoryService.getCategories(query);

    return SuccessResponse.send(
      res,
      {
        message: result.message || CATEGORY_MESSAGES.LIST_FETCHED,
        data: result.data,
        meta: result.meta,
      },
      StatusCodes.OK
    );
  });

  /**
   * Get Category By ID Handler
   * GET /api/v1/question-categories/:id
   */
  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await categoryService.getCategoryById(id);

    return SuccessResponse.send(
      res,
      {
        message: result.message || CATEGORY_MESSAGES.FETCHED,
        data: result.data,
      },
      StatusCodes.OK
    );
  });

  /**
   * Update Category Handler
   * PATCH /api/v1/question-categories/:id
   */
  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payload = req.validatedData || req.body;
    const userId = req.user.id;

    const result = await categoryService.updateCategory(id, payload, userId);

    return SuccessResponse.send(
      res,
      {
        message: result.message || CATEGORY_MESSAGES.UPDATED,
        data: result.data,
      },
      StatusCodes.OK
    );
  });

  /**
   * Soft Delete Category Handler
   * DELETE /api/v1/question-categories/:id
   */
  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await categoryService.deleteCategory(id, userId);

    return SuccessResponse.send(
      res,
      {
        message: result.message || CATEGORY_MESSAGES.DELETED,
        data: result.data,
      },
      StatusCodes.OK
    );
  });

  /**
   * Restore Soft Deleted Category Handler
   * PATCH /api/v1/question-categories/:id/restore
   */
  restore = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await categoryService.restoreCategory(id, userId);

    return SuccessResponse.send(
      res,
      {
        message: result.message || CATEGORY_MESSAGES.RESTORED,
        data: result.data,
      },
      StatusCodes.OK
    );
  });
}

const categoryController = new CategoryController();

module.exports = categoryController;
