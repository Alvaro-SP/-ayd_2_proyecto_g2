const express = require('express')
const router = express.Router()
const control = require('../Controllers/controluser')


router.get("/", control.prueba)

router.post("/verperfil", control.verperfil)

router.post("/editarperfil", control.editarperfil)

router.post("/follow", control.follow)

router.post("/usuarios", control.usuarios)

router.post("/unfollow",control.unfollow)
//router.post("/tipoauth", control.tipoauth)

module.exports = router 