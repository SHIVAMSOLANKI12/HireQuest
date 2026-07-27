const resultService = require('./result.service');
const { RESULT_MESSAGES } = require('./result.constants');

class ResultController {
  async getAll(req, res, next) {
    try {
      const results = await resultService.getAllResults();
      res.status(200).json({
        success: true,
        message: RESULT_MESSAGES.FETCHED,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ResultController();
