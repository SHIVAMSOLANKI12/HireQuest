const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("../../common/middlewares/async-handler");
const { SuccessResponse } = require("../../common/response");
const { TAG_MESSAGES } = require("./constants/tag-message.constants");
const tagService = require("./tag.service");

/**
 * ==========================================================
 * Enterprise Tag Controller
 * ==========================================================
 * Express HTTP handlers for Tag module endpoints.
 * Uses req.validatedData and delegates 100% to Tag service.
 * ==========================================================
 */
class TagController {
  /**
   * Create Tag Handler
   * POST /api/v1/question-tags
   */
  create = asyncHandler(async (req, res) => {
    const payload = req.validatedData || req.body;
    const userId = req.user.id;

    const result = await tagService.createTag(payload, userId);

    return SuccessResponse.send(
      res,
      {
        message: result.message || TAG_MESSAGES.CREATED,
        data: result.data,
      },
      StatusCodes.CREATED
    );
  });

  /**
   * List Tags Handler (Paginated, Filtered, Sorted, Searched)
   * GET /api/v1/question-tags
   */
  list = asyncHandler(async (req, res) => {
    const query = req.validatedData || req.query;

    const result = await tagService.getTags(query);

    return SuccessResponse.send(
      res,
      {
        message: result.message || TAG_MESSAGES.LIST_FETCHED,
        data: result.data,
        meta: result.meta,
      },
      StatusCodes.OK
    );
  });

  /**
   * Get Tag By ID Handler
   * GET /api/v1/question-tags/:id
   */
  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await tagService.getTagById(id);

    return SuccessResponse.send(
      res,
      {
        message: result.message || TAG_MESSAGES.FETCHED,
        data: result.data,
      },
      StatusCodes.OK
    );
  });

  /**
   * Update Tag Handler
   * PATCH /api/v1/question-tags/:id
   */
  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payload = req.validatedData || req.body;
    const userId = req.user.id;

    const result = await tagService.updateTag(id, payload, userId);

    return SuccessResponse.send(
      res,
      {
        message: result.message || TAG_MESSAGES.UPDATED,
        data: result.data,
      },
      StatusCodes.OK
    );
  });

  /**
   * Soft Delete Tag Handler
   * DELETE /api/v1/question-tags/:id
   */
  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await tagService.deleteTag(id, userId);

    return SuccessResponse.send(
      res,
      {
        message: result.message || TAG_MESSAGES.DELETED,
        data: result.data,
      },
      StatusCodes.OK
    );
  });

  /**
   * Restore Soft Deleted Tag Handler
   * PATCH /api/v1/question-tags/:id/restore
   */
  restore = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await tagService.restoreTag(id, userId);

    return SuccessResponse.send(
      res,
      {
        message: result.message || TAG_MESSAGES.RESTORED,
        data: result.data,
      },
      StatusCodes.OK
    );
  });
}

const tagController = new TagController();

module.exports = tagController;
