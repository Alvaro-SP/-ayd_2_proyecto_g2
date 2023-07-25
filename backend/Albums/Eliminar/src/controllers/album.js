const db = require('../db/conexion');


exports.eliminarAlbums = async (req, res) => {
    let datos = req.body;
    const sql = `CALL eliminarReferenciasAlbum(?)`;
    const sql2 = `CALL eliminarAlbum(?)`;
    console.log("datos: ", datos);
    try {
        if (datos.idAlbum == null || datos.idAlbum == "") {
            return res.status(500).json({ mensaje: "Error al eliminar album" });
        }

        await db.query(sql, [datos.idAlbum]);
        await db.query(sql2, [datos.idAlbum]);

        return res.status(200).json({ mensaje: 'Album eliminado' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: "Error al listar albums", error });
    }
}

