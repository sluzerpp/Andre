const ApiError = require('../error/ApiError');
const jsonwebtoken = require('jsonwebtoken');

const generateJWT = (role) => {
  return jsonwebtoken.sign(
    {role: role}, 
    process.env.SECRET_KEY,
    {expiresIn: '24h'}
  );
}

class AdminController {
  async login(req, res, next) {
    try {
      const { password } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD || '123qwe';
      if (adminPassword !== password) {
        return next(ApiError.badRequest('Неверный пароль!'));
      }
      const token = generateJWT('ADMIN');

      return res.json({token});
    } catch (error) {
      next(ApiError.internal(error.message));
    }
  }

  async check(req, res, next) {
    const token = generateJWT('ADMIN');
    return res.json({token});
  }
}

const controller = new AdminController();

module.exports = controller;