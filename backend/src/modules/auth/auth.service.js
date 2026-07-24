const authRepository = require('./auth.repository');

class AuthService {
  async register(userData) {
    return authRepository.createUser(userData);
  }

  async login(credentials) {
    return authRepository.findByEmail(credentials.email);
  }
}

module.exports = new AuthService();
