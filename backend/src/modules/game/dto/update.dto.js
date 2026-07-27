class UpdateGameDto {
  constructor({ title, rules }) {
    if (title) this.title = title;
    if (rules) this.rules = rules;
  }
}

module.exports = UpdateGameDto;
