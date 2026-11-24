'use strict';

const db = require('../models');

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

module.exports = {
  getAllKomik,
  getKomikById
};
