const candidateService = require('./candidate.service');
const { CANDIDATE_MESSAGES } = require('./candidate.constants');

class CandidateController {
  async getAll(req, res, next) {
    try {
      const candidates = await candidateService.getCandidates();
      res.status(200).json({
        success: true,
        message: CANDIDATE_MESSAGES.FETCHED,
        data: candidates,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CandidateController();
