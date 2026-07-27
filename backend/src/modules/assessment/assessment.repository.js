const prisma = require('../../config/database');

class AssessmentRepository {
  async findAll() {
    return [];
  }

  async findById(id) {
    return null;
  }

  async create(data) {
    return data;
  }
}

module.exports = new AssessmentRepository();
