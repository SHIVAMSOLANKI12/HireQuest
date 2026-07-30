const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("../../common/middlewares/async-handler");
const { SuccessResponse } = require("../../common/response");
const { QUESTION_MESSAGES } = require("./question.constants");
const questionService = require("./question.service");

/**
 * ==========================================================
 * Enterprise Question Controller
 * ==========================================================
 * Express HTTP handlers for Question Bank endpoints.
 * Uses req.validatedData and delegates 100% to Question service.
 * ==========================================================
 */
class QuestionController {
  /**
   * Create Question Handler
   * POST /api/v1/questions
   */
  create = asyncHandler(async (req, res) => {
    const payload = req.validatedData || req.body;
    const userId = req.user.id;

    const result = await questionService.createQuestion(payload, userId);

    return SuccessResponse.send(
      res,
      {
        message: result.message || QUESTION_MESSAGES.CREATE_SUCCESS,
        data: result.data,
      },
      StatusCodes.CREATED
    );
  });

  /**
   * List Questions Handler (Paginated, Searchable, Sortable, Multi-filtered)
   * GET /api/v1/questions
   */
  list = asyncHandler(async (req, res) => {
    const query = req.validatedData || req.query;

    const result = await questionService.getQuestions(query);

    return SuccessResponse.send(
      res,
      {
        message: result.message || QUESTION_MESSAGES.QUESTIONS_FETCHED,
        data: result.data,
        meta: result.meta,
      },
      StatusCodes.OK
    );
  });

  /**
   * Get Question By ID Handler
   * GET /api/v1/questions/:id
   */
  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await questionService.getQuestionById(id);

    return SuccessResponse.send(
      res,
      {
        message: result.message || QUESTION_MESSAGES.QUESTION_FETCHED,
        data: result.data,
      },
      StatusCodes.OK
    );
  });

  /**
   * Update Question Handler
   * PATCH /api/v1/questions/:id
   */
  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payload = req.validatedData || req.body;
    const userId = req.user.id;

    const result = await questionService.updateQuestion(id, payload, userId);

    return SuccessResponse.send(
      res,
      {
        message: result.message || QUESTION_MESSAGES.UPDATE_SUCCESS,
        data: result.data,
      },
      StatusCodes.OK
    );
  });

  /**
   * Soft Delete Question Handler
   * DELETE /api/v1/questions/:id
   */
  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await questionService.deleteQuestion(id, userId);

    return SuccessResponse.send(
      res,
      {
        message: result.message || QUESTION_MESSAGES.DELETE_SUCCESS,
        data: result.data,
      },
      StatusCodes.OK
    );
  });

  /**
   * Publish Question Handler
   * POST /api/v1/questions/:id/publish
   */
  publish = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await questionService.publishQuestion(id, userId);

    return SuccessResponse.send(
      res,
      {
        message: result.message || QUESTION_MESSAGES.PUBLISH_SUCCESS,
        data: result.data,
      },
      StatusCodes.OK
    );
  });

  /**
   * Archive Question Handler
   * POST /api/v1/questions/:id/archive
   */
  archive = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await questionService.archiveQuestion(id, userId);

    return SuccessResponse.send(
      res,
      {
        message: result.message || QUESTION_MESSAGES.ARCHIVE_SUCCESS,
        data: result.data,
      },
      StatusCodes.OK
    );
  });
}

const questionController = new QuestionController();

module.exports = questionController;
