class UpdateCandidateDto {
  constructor({ name, phone }) {
    if (name) this.name = name;
    if (phone) this.phone = phone;
  }
}

module.exports = UpdateCandidateDto;
