const express = require('express');
const router = express.Router();

const { CrearAlbum} = require('../controllers/album');

router.post('/crearalbum', CrearAlbum);


module.exports = router;