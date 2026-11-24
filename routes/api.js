'use strict';

const express = require('express');
const router = express.Router();
const komikController = require('../controller/komikController');
const userController = require('../controller/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/komik', komikController.getAllKomik);
router.get('/komik/:id', komikController.getKomikById);

module.exports = router;
