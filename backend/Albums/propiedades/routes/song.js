const { Router, json, application } = require('express');
const connect = require('../config/conexion');
const router = Router();


// Get info Song
router.get('/song', async (req, res) => {
    let datos = req.params;
    console.log(datos);
    try{
        let sql = "SELECT nombre_cancion,extension,fecha,link FROM CANCION WHERE ALBUM_idALBUM = ?;";

        connect.query(sql, async function (err, result, field) {
            if (err) {
                res.status(400).json({
                    metodo: "api/album/song",
                    entrada: datos,
                    salida: err.toString(),
                    esError: "true"});
                    } else {
                        let array = await result.map((row) => {
                            return {
                                nombre_cancion: row.nombre_cancion,
                                extension: row.extension,
                                fecha: row.fecha,
                                link: row.link
                            }
                        });

                        res.status(200).json({
                            metodo: "api/album/song",
                            entrada: datos,
                            salida: array,
                            esError: "false"});
                            }
            });
    } catch (e) {
        res.status(400).json({
            metodo: "api/album/song",
            entrada: datos,
            salida: e.toString(),
            esError: "true"});
    }
});


// Exporting the module
module.exports = router;
