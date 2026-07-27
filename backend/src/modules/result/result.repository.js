const prisma = require('../../config/database');

class ResultRepository {
  async findAll() {
    return [];
  }

  async findById(id) {
    return null;
  }
}

module.exports = new ResultRepository();
