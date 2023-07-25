const express = require('express');
const router = express.Router();

const { editarAlbums } = require('../controllers/album');

router.post('/editaralbum',editarAlbums );


module.exports = router;