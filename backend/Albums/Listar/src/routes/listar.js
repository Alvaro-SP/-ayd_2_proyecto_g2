const express = require('express');
const router = express.Router();

const { listarAlbums} = require('../controllers/album');

router.post('/listaralbums', listarAlbums);


module.exports = router;