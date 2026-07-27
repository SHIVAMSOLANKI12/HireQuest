const candidateRepository = require('./candidate.repository');

class CandidateService {
  async getCandidates() {
    return candidateRepository.findAll();
  }

  async getCandidateById(id) {
    return candidateRepository.findById(id);
  }
}

module.exports = new CandidateService();
