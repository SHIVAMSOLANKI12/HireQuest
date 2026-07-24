const assessmentRepository = require('./assessment.repository');

class AssessmentService {
  async getAllAssessments() {
    return assessmentRepository.findAll();
  }

  async getAssessmentById(id) {
    return assessmentRepository.findById(id);
  }

  async createAssessment(data) {
    return assessmentRepository.create(data);
  }
}

module.exports = new AssessmentService();
