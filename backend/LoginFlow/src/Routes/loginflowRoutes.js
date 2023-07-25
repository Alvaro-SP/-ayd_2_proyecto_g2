const express = require('express')
const router = express.Router()
const control = require('../Controllers/loginflowController')

router.get("/", control.index)
router.post("/registro", control.registro)
router.post("/login", control.login)
router.post("/login2fa", control.login2fa)

module.exports = router 