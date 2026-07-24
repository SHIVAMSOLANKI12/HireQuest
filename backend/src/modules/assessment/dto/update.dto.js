class UpdateAssessmentDto {
  constructor({ title, description, durationMinutes }) {
    if (title) this.title = title;
    if (description) this.description = description;
    if (durationMinutes) this.durationMinutes = durationMinutes;
  }
}

module.exports = UpdateAssessmentDto;
