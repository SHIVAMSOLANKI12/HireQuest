const prisma = require('../../config/database');

class GameRepository {
  async findAll() {
    return [];
  }

  async findById(id) {
    return null;
  }
}

module.exports = new GameRepository();
