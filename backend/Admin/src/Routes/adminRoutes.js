const express = require('express')
const router = express.Router()
const control = require('../Controllers/adminController')

router.get("/", control.prueba)
router.get("/solicitudes", control.solicitudes)
router.get("/usuarios", control.usuarios)
router.patch("/aceptar", control.aceptar)
router.patch("/rechazar", control.denegar)
router.patch("/dar_baja", control.dar_baja)

// reportes
router.post("/vertopsongs", control.vertopsongs)
router.post("/vertopfollowers", control.vertopfollowers)
router.post("/vertoptime", control.vertoptime)

module.exports = router 