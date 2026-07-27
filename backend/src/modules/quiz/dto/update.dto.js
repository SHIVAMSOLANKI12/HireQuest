class UpdateQuizDto {
  constructor({ title, questions }) {
    if (title) this.title = title;
    if (questions) this.questions = questions;
  }
}

module.exports = UpdateQuizDto;
