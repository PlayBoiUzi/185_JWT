'use strict';

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization || '';
  const match = /^Bearer\s+(\S+)$/i.exec(authorization);
  if (!match) {
    return res.status(401).json({
      message: 'Token Bearer tidak ditemukan atau formatnya tidak valid.'
    });
  }

  try {
    req.user = jwt.verify(match[1], process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token tidak valid atau telah kedaluwarsa.'
    });
  }
}

module.exports = authMiddleware;
