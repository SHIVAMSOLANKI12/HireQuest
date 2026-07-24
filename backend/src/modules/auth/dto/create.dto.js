class CreateUserDto {
  constructor({ email, password, name, role }) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.role = role || 'JOB_SEEKER';
  }
}

module.exports = CreateUserDto;
