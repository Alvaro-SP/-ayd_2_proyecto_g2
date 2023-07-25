const { Router, json, application } = require('express');
const connect = require('../config/conexion');
const router = Router();


// Get info album
router.get('/album', async (req, res) => {
    let datos = req.params;
    console.log(datos);
    try{        
        let sql = "SELECT nombre,fecha_creacion,cant_canciones FROM ALBUM WHERE USER_id = ?;";

        connect.query(sql, async function (err, result, field) {
            if (err) {
                res.status(400).json({
                    metodo: "api/album/propiedades",
                    entrada: datos,
                    salida: err.toString(),
                    esError: "true"});
                    } else {
                        let array = await result.map((row) => {
                            return {
                                nombre: row.nombre,
                                fecha_creacion: row.fecha_creacion,
                                cant_canciones: row.cant_canciones
                            }
                        });

                        res.status(200).json({
                            metodo: "api/album/propiedades",
                            entrada: datos,
                            salida: array,
                            esError: "false"});
                            }
            });  
    } catch (e) {
        res.status(400).json({
            metodo: "api/album/propiedades",
            entrada: datos,
            salida: e.toString(),
            esError: "true"});
    }
});


// Exporting the module
module.exports = router;