const resultRepository = require('./result.repository');

class ResultService {
  async getAllResults() {
    return resultRepository.findAll();
  }

  async getResultById(id) {
    return resultRepository.findById(id);
  }
}

module.exports = new ResultService();
