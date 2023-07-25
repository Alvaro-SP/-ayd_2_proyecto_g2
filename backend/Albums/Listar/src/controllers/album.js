const db = require('../db/conexion');


//funcion para listar albums de usuario
exports.listarAlbums = async (req, res) => {
    let datos = req.body;
    const sql = `CALL listarAlbums(?)`;
    console.log("datos: ", datos);
    try {
        const resultDB = await db.query(sql, [datos.idUser]);
        res.status(200).json({ albums: resultDB[0] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al listar albums", error });
    }
}

