const db = require('../db/conexion');
const { cargarImangeS3, getImagen } = require('./stres');

exports.editarAlbums = async (req, res) => {
    const datos = req.body;
    console.log(datos);
    // Primer paso: modificar album destino (actualizar nombre, imagen, cantidad de canciones)
    const sql = `CALL editarAlbum(?, ?, ?)`;
    const sql2 = `CALL eliminarReferenciaAlbum(?)`;
    const sql3 = `CALL agregarReferenciaAlbum(?, ?)`;

    try {
        // Primero se sube la imagen a S3
        if (datos.imagenAlbum != null && datos.imagenAlbum != "" && datos.imagenAlbum != undefined) {
            // Quitar lo que no es base64
            const base64Data = datos.imagenAlbum.replace(/^data:image\/\w+;base64,/, "");
            // Subir imagen a S3
            const imagenS3 = await cargarImangeS3(base64Data, 'png');
            // Guardar link de imagen en base de datos
            datos.imagenAlbum = imagenS3;
        }

        await db.query(sql, [datos.idAlbumOrigen, datos.nombreAlbum, datos.imagenAlbum]);

        // Segundo paso: eliminar canciones del album origen
        if (datos.cancionesEliminadas.length > 0) {
            for (const cancion of datos.cancionesEliminadas) {
                await db.query(sql2, [cancion.idCANCION]);
            }
        }

        // Tercer paso: agregar nuevas canciones en el album origen
        if (datos.nuevasCanciones.length > 0) {
            for (const cancion of datos.nuevasCanciones) {
                
                await db.query(sql3, [cancion.idCANCION,datos.idAlbumOrigen]);
                console.log("se esta agregando cancion: ", cancion.idCANCION, " al album: ", datos.idAlbumOrigen);
            }
        }

        // Cuarto paso: agregar canciones seleccionadas hacia el album destino
        if (datos.cancionesSeleccionadas.length > 0) {
            for (const idCancion of datos.cancionesSeleccionadas) {
                await db.query(sql3, [idCancion,datos.idAlbumDestino]);
            }  
        }
        res.status(200).json({ mensaje: "Album editado con éxito" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al editar album", error });
    }
};


/*{
*idAlbumOrigen: 3,
*nombreAlbum: '',
 * nuevasCanciones: [
    {
      idCANCION: 28,
      nombre_cancion: 'cancionsinalbum',
      id: 28,
      nombre: 'cancionsinalbum'
    }
  ],
 * cancionesEliminadas: [
    {
      id: 24,
      nombre: 'cancionprueba2',
      link: 'linkcancion',
      fecha: '2023-06-06T06:00:00.000Z',
      no_reproducciones: 1,
      idCANCION: 24,
      nombre_cancion: 'cancionprueba2'
    }
  ],
  *cancionesSeleccionadas: [ 20, 22 ],
  *idAlbumDestino: 4,
  *imagenAlbum:
}
*/