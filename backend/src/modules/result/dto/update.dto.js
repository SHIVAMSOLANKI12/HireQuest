class UpdateResultDto {
  constructor({ score, metrics }) {
    if (score !== undefined) this.score = score;
    if (metrics) this.metrics = metrics;
  }
}

module.exports = UpdateResultDto;
