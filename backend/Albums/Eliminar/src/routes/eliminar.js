const express = require('express');
const router = express.Router();

const { eliminarAlbums} = require('../controllers/album');

router.post('/eliminaralbums', eliminarAlbums);


module.exports = router;