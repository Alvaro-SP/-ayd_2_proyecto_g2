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
class VerPerfil extends AbstractController {
    constructor() { super() }

    async ejecutar(req, res) {
        var decoded;
        var con = await mysql.createConnection(dbconfg);
        try {
            // Vamos a desencriptar nuestro objeto USUARIO utilizando la llave con que fue creado:
            try {
                // Verificar y desencriptar el token
                decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
                // Los datos originales se encuentran en el objeto decoded
                console.log(decoded);
            } catch (error) {
                // console.error('Error al desencriptar el token: ', error);
                res.json({ error: "Error al desencriptar el token" });
                return;
            }
            let id_user = decoded.id;
            var sql = `CALL GetUserWithFollowers('${id_user}');`;
            const [rows] = await con.query(sql);

            console.log("----------------datos consultados----------------");
            const consultaResult = rows[1];

            //decodificamos el correo:
            const decipher = crypto.createDecipheriv(
                process.env.CRYPTO_ALGORITHM,
                process.env.CRYPTO_KEY,
                process.env.CRYPTO_IV
            );

            let decrypted = decipher.update(consultaResult[0].correo, "hex", "utf8");
            decrypted += decipher.final("utf8");

            const decipher2 = crypto.createDecipheriv(
                process.env.CRYPTO_ALGORITHM,
                process.env.CRYPTO_KEY,
                process.env.CRYPTO_IV
            );
            //decodifico la contrasena:
            let decryptedpass = decipher2.update(
                consultaResult[0].contraseña,
                "hex",
                "utf8"
            );
            decryptedpass += decipher2.final("utf8");

            consultaResult[0].correo = decrypted;
            consultaResult[0].contraseña = decryptedpass;

            res.statusCode = 200;
            res.jsonp(consultaResult);
        } catch (error) {
            console.log(error);
            res.statusCode = 400;
            res.json({ error: "Error al consultar los datos de usuario." });
        }
    }
}


module.exports = VerPerfil