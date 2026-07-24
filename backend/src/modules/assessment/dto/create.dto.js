class CreateAssessmentDto {
  constructor({ title, description, durationMinutes }) {
    this.title = title;
    this.description = description;
    this.durationMinutes = durationMinutes;
  }
}

module.exports = CreateAssessmentDto;
