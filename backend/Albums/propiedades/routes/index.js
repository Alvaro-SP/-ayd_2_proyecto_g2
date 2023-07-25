const { Router, json } = require('express');
const router = Router();


// Root
router.get('/', (req, res) => {
    res.json({
        metodo: "Conexion exitosa",
        entrada: "N/A",
        salida: "Servidor conectado",
        esError: "false"});
});

// Exporting the module
module.exports = router;
