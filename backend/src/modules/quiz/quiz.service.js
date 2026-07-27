const quizRepository = require('./quiz.repository');

class QuizService {
  async getAllQuizzes() {
    return quizRepository.findAll();
  }

  async getQuizById(id) {
    return quizRepository.findById(id);
  }
}

module.exports = new QuizService();
