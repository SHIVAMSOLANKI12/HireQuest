class CreateGameDto {
  constructor({ title, gameType, rules }) {
    this.title = title;
    this.gameType = gameType;
    this.rules = rules;
  }
}

module.exports = CreateGameDto;
