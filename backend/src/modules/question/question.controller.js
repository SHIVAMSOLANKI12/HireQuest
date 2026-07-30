const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("../../utils/asyncHandler");
const { SuccessResponse } = require("../../common/response");
const questionService = require("./question.service");
const { QUESTION_MESSAGES } = require("./question.constants");

/**
 * ==========================================================
 * Enterprise Question Controller
 * ==========================================================
 * Express HTTP handlers for Question module endpoints.
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

    const data = result?.data !== undefined ? result.data : result;
    const message = result?.message || QUESTION_MESSAGES.CREATE_SUCCESS;

    return SuccessResponse.send(
      res,
      {
        message,
        data,
      },
      StatusCodes.CREATED
    );
  });
}

const questionController = new QuestionController();

module.exports = questionController;
