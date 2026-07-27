class CreateResultDto {
  constructor({ candidateId, assessmentId, score, metrics }) {
    this.candidateId = candidateId;
    this.assessmentId = assessmentId;
    this.score = score;
    this.metrics = metrics;
  }
}

module.exports = CreateResultDto;
