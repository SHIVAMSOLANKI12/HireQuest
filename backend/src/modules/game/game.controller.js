const gameService = require('./game.service');
const { GAME_MESSAGES } = require('./game.constants');

class GameController {
  async getAll(req, res, next) {
    try {
      const games = await gameService.getAllGames();
      res.status(200).json({
        success: true,
        message: GAME_MESSAGES.FETCHED,
        data: games,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GameController();
