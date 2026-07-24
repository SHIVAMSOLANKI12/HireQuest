const authService = require('./auth.service');
const { AUTH_MESSAGES } = require('./auth.constants');

class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: AUTH_MESSAGES.REGISTER_SUCCESS,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json({
        success: true,
        message: AUTH_MESSAGES.LOGIN_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
