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

class Usuarios extends AbstractController {
    constructor() { super() }
    async ejecutar(req, res) {
        var decoded;
        var con = await mysql.createConnection(dbconfg);
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
            var sql = `
                      SELECT u.*, IF(s.USER_seguido IS NOT NULL, 1, 0) AS esSeguido
                      FROM USER u
                      LEFT JOIN (
                          SELECT *
                          FROM SEGUIDOS
                          WHERE USER_seguidor = '${id_user}'
                      ) s ON u.id = s.USER_seguido
                      WHERE u.id <> '${id_user}' AND u.tipo_usuario != 0;
                  `;

            // SELECT *
            // FROM USER
            // WHERE id <> '${id_user}' AND tipo_usuario != 0
            // AND id NOT IN (
            //     SELECT USER_seguido
            //     FROM SEGUIDOS
            //     WHERE USER_seguidor = '${id_user}'
            // ) ;

            // SELECT u.*
            //     FROM USER u
            //     LEFT JOIN SEGUIDOS s ON u.id = s.USER_seguido AND s.USER_seguidor = '${id_user}'
            //     WHERE s.idSEGUIDOS IS NULL AND id <> '${id_user}' AND tipo_usuario != 0;
            //     SELECT u.*
            //     FROM USER u
            //     JOIN SEGUIDOS s ON u.id = s.USER_seguido AND s.USER_seguidor = '${id_user}';
            const [rows] = await con.query(sql);
            console.log(rows)
            res.statusCode = 200;
            res.json(rows);
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

module.exports = Usuarios