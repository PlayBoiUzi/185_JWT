'use strict';

const db = require('../models');

function readKomikFields(body) {
  const fields = ['title', 'description', 'author'];
  if (!body || fields.some(field => (
    typeof body[field] !== 'string' || body[field].trim() === ''
  ))) {
    return null;
  }

  return Object.fromEntries(fields.map(field => [field, body[field].trim()]));
}

async function getAllKomik(req, res) {
  try {
    const komik = await db.Komik.findAll();
    return res.status(200).json(komik);
  } catch (error) {
    console.error('Gagal mengambil daftar komik:', error);
    return res.status(500).json({ error: 'Gagal mengambil daftar komik.' });
  }
}

async function getKomikById(req, res) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: 'ID komik tidak valid.' });
  }

  try {
    const komik = await db.Komik.findByPk(id);
    if (!komik) {
      return res.status(404).json({ error: 'Komik tidak ditemukan.' });
    }

    return res.status(200).json(komik);
  } catch (error) {
    console.error('Gagal mengambil komik:', error);
    return res.status(500).json({ error: 'Gagal mengambil komik.' });
  }
}

async function createKomik(req, res) {
  const fields = readKomikFields(req.body);
  if (!fields) {
    return res.status(400).json({
      error: 'Judul, deskripsi, dan penulis wajib diisi.'
    });
  }

  try {
    const newKomik = await db.Komik.create(fields);
    return res.status(201).json(newKomik);
  } catch (error) {
    console.error('Gagal membuat komik:', error);
    return res.status(500).json({ error: 'Gagal membuat komik.' });
  }
}

async function updateKomik(req, res) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: 'ID komik tidak valid.' });
  }

  const fields = readKomikFields(req.body);
  if (!fields) {
    return res.status(400).json({
      error: 'Judul, deskripsi, dan penulis wajib diisi.'
    });
  }

  try {
    const komik = await db.Komik.findByPk(id);
    if (!komik) {
      return res.status(404).json({ error: 'Komik tidak ditemukan.' });
    }

    await komik.update(fields);
    return res.status(200).json(komik);
  } catch (error) {
    console.error('Gagal memperbarui komik:', error);
    return res.status(500).json({ error: 'Gagal memperbarui komik.' });
  }
}

module.exports = {
  getAllKomik,
  getKomikById,
  createKomik,
  updateKomik
};
