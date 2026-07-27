class CreateQuizDto {
  constructor({ title, questions }) {
    this.title = title;
    this.questions = questions || [];
  }
}

module.exports = CreateQuizDto;
