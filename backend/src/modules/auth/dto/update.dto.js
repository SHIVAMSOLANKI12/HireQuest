class UpdateUserDto {
  constructor({ name, password }) {
    if (name) this.name = name;
    if (password) this.password = password;
  }
}

module.exports = UpdateUserDto;
