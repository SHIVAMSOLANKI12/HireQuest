const prisma = require('../../config/database');

class CandidateRepository {
  async findAll() {
    return [];
  }

  async findById(id) {
    return null;
  }
}

module.exports = new CandidateRepository();
