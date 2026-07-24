const assessmentService = require('./assessment.service');
const { ASSESSMENT_MESSAGES } = require('./assessment.constants');

class AssessmentController {
  async getAll(req, res, next) {
    try {
      const assessments = await assessmentService.getAllAssessments();
      res.status(200).json({
        success: true,
        message: ASSESSMENT_MESSAGES.FETCHED,
        data: assessments,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const assessment = await assessmentService.createAssessment(req.body);
      res.status(201).json({
        success: true,
        message: ASSESSMENT_MESSAGES.CREATED,
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AssessmentController();
