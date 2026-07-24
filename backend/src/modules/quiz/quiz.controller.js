const quizService = require('./quiz.service');
const { QUIZ_MESSAGES } = require('./quiz.constants');

class QuizController {
  async getAll(req, res, next) {
    try {
      const quizzes = await quizService.getAllQuizzes();
      res.status(200).json({
        success: true,
        message: QUIZ_MESSAGES.FETCHED,
        data: quizzes,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QuizController();
