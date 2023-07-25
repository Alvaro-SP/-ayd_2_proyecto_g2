const AbstractController = require('./AbstractController')
const mysql = require("mysql2/promise");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const AES = require("crypto-js");
var dbconfg = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
};

class EditarPerfil extends AbstractController {
    constructor() { super() }

    async ejecutar(req, res) {
        const data = req.body; //! Suponiendo que los datos se envían en el cuerpo de la solicitud
        var con = await mysql.createConnection(dbconfg);
        var decoded;
        try {
            //! Vamos a desencriptar nuestro objeto USUARIO utilizando la llave con que fue creado:
            try {
                //! Verificar y desencriptar el token
                decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
                // Los datos originales se encuentran en el objeto decoded
                console.log(decoded);
            } catch (error) {
                // console.error('Error al desencriptar el token: ', error);
                res.json({ error: "Error al desencriptar el token" });
                return;
            }
            var id_user = decoded.id;
            //!cifrando correo
            const cipherC = crypto.createCipheriv(
                process.env.CRYPTO_ALGORITHM,
                process.env.CRYPTO_KEY,
                process.env.CRYPTO_IV
            );
            let correoC = cipherC.update(data.correo, "utf-8", "hex");
            correoC += cipherC.final("hex");

            //!descifrando password
            const decrypted = AES.AES.decrypt(
                data.password,
                process.env.CRYPTO_KEY_FRONTEND
            ).toString(AES.enc.Utf8);
            //!encriptando nuevamente la password
            const cipherP = crypto.createCipheriv(
                process.env.CRYPTO_ALGORITHM,
                process.env.CRYPTO_KEY,
                process.env.CRYPTO_IV
            );
            let passC = cipherP.update(decrypted, "utf-8", "hex");
            passC += cipherP.final("hex");
            var sql = `UPDATE USER SET nombre = '${data.nombre}', correo = '${correoC}', nacimiento = '${data.fecha_nacimiento}', contraseña = '${passC}', auth = '${data.auth}', tipoAuth = '${data.tipoAuth}' WHERE id = '${id_user}'`;
            const [rows] = await con.query(sql);
            if (rows && rows.affectedRows > 0) {
                // Cerrar la conexión a la base de datos
                con.end();
                res.statusCode = 200;
                res.json({
                    success: true,
                    message: "Datos actualizados correctamente.",
                });
            } else {
                console.log(err);
                res.statusCode = 400;
                res.json({
                    success: false,
                    message: "Error al actualizar los datos de usuario.",
                });
            }
        } catch (error) {
            console.log(error);
            res.statusCode = 400;
            res.json({ success: false });
        }
    }
}

module.exports=EditarPerfil