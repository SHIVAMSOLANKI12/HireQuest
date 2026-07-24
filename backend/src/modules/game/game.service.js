const gameRepository = require('./game.repository');

class GameService {
  async getAllGames() {
    return gameRepository.findAll();
  }

  async getGameById(id) {
    return gameRepository.findById(id);
  }
}

module.exports = new GameService();
