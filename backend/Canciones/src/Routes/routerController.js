const express = require('express')
const router = express.Router()
const control = require('../Controllers/indexControllers')
const disableCache = (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  };

router.get("/", control.prueba)

router.get("/getcanciones/:id_user/:id_album", control.Canciones_Album)

router.get("/getcancion/:id_user/:id_album/:id_cancion", control.Cancion)

router.post("/infocanciones", control.addInfoCanciones)

router.get("/getcancionessinalbum", control.CancionesSinAlbum)

router.post("/subircancion",control.subirCanciones)

module.exports = router 