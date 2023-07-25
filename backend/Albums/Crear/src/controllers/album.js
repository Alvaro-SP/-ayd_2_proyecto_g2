const db = require('../db/conexion');
const { cargarImangeS3, getImagen } = require('../controllers/stres');

//crear album
//req.body = {nombre, arrayCanciones(id's canciones), linkimagen, id_usuario}
exports.CrearAlbum = async (req, res) => {
    let datos = req.body;
    const sql3 = `CALL agregarReferenciaAlbum(?, ?)`;
    //if (datos.arrayCanciones == null || datos.arrayCanciones == "" || datos.arrayCanciones == undefined) {
    //    datos.cant = 0;
    //} else {
    //    datos.cant = datos.arrayCanciones.length;
    //}
    //se sube la imagen a S3
    if (datos.linkimg != null && datos.linkimg != "" && datos.linkimg != undefined) {
        // Quitar lo que no es base64
        const base64Data = datos.linkimg.replace(/^data:image\/\w+;base64,/, "");
        // Subir imagen a S3
        const imagenS3 = await cargarImangeS3(base64Data, 'png');
        // Guardar link de imagen en base de datos
        datos.linkimg = imagenS3;
    }

    // Generar fecha actual
    let fecha = new Date();
    datos.fecha = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate();

    const sql = `CALL crearAlbum(?, ?, ?, ?, ?)`;
    console.log("datos: ", datos);

    try {
        const resultDB = await db.query(sql, [datos.nom, datos.fecha, 0, datos.linkimg, datos.idUser]);

        if (datos.arrayCanciones != null && datos.arrayCanciones != "" && datos.arrayCanciones != undefined) {

            for (const cancion of datos.arrayCanciones) {
                await db.query(sql3, [cancion.idCANCION, resultDB[0][0].idAlbum]);
        }
    }

        res.status(200).json({ mensaje: "Album creado con éxito" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al crear álbum", error });
    }
}

