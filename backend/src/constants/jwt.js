module.exports = {
  JWT_CONFIG: {
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    SECRET: process.env.JWT_SECRET || 'super_secret_jwt_key_hirequest_2026',
  },
};
