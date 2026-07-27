const prisma = require('../../config/database');

class QuizRepository {
  async findAll() {
    return [];
  }

  async findById(id) {
    return null;
  }
}

module.exports = new QuizRepository();
