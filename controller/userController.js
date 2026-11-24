'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');

async function register(req, res) {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' ||
      email.trim() === '' || password.length === 0) {
    return res.status(400).json({
      message: 'Email dan kata sandi wajib diisi.'
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existingUser = await db.User.findOne({
      where: { email: normalizedEmail }
    });
    if (existingUser) {
      return res.status(409).json({ message: 'Email sudah terdaftar.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.User.create({
      email: normalizedEmail,
      password: hashedPassword
    });

    return res.status(201).json({
      message: 'Registrasi berhasil.',
      data: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Email sudah terdaftar.' });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Format email tidak valid.' });
    }

    console.error('Gagal mendaftarkan pengguna:', error);
    return res.status(500).json({ message: 'Registrasi gagal.' });
  }
}

async function login(req, res) {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' ||
      email.trim() === '' || password.length === 0) {
    return res.status(400).json({
      message: 'Email dan kata sandi wajib diisi.'
    });
  }

  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES;
  if (!secret || !expiresIn) {
    console.error('JWT_SECRET dan JWT_EXPIRES harus dikonfigurasi.');
    return res.status(500).json({ message: 'Konfigurasi autentikasi belum lengkap.' });
  }

  try {
    const user = await db.User.findOne({
      where: { email: email.trim().toLowerCase() }
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Email atau kata sandi salah.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      secret,
      { expiresIn }
    );

    return res.status(200).json({
      message: 'Login berhasil.',
      token
    });
  } catch (error) {
    console.error('Gagal login:', error);
    return res.status(500).json({ message: 'Login gagal.' });
  }
}

module.exports = {
  register,
  login
};
