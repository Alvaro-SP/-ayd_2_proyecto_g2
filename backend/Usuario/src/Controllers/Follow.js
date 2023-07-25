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

class Follow extends AbstractController {
    constructor() { super() }
    async ejecutar(req, res) {
        const data = req.body; //! Suponiendo que los datos se envían en el cuerpo de la solicitud
        var con = await mysql.createConnection(dbconfg);
        var decoded;
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
        try {
            var sql = `INSERT INTO SEGUIDOS (USER_seguidor, USER_seguido)
          VALUES ('${id_user}', '${data.id_seguido}')`;
            const [rows] = await con.query(sql);
            res.statusCode = 200;
            res.json({ success: true, message: "Usuario seguido con Exito." });
        } catch (error) {
            console.log(error);
            res.statusCode = 400;
            res.json({
                success: false,
                message: "Error al seguir al usuario, talvez ya lo sigue.",
            });
        }
    }
}

module.exports = Follow