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

const Prueba = require('./Prueba')
const UserDecorator = require('./UserDecorator')
const VerPerfil = require('./VerPerfil')
const EditarPerfil = require('./EditarPerfil')
const Follow = require('./Follow')
const Usuarios = require('./Usuarios')

exports.prueba = async (req, res) => {
  const ud = new UserDecorator(new Prueba())
  return ud.ejecutar(req, res)
}


exports.verperfil = async (req, res) => {
  const vp = new VerPerfil()
  return vp.ejecutar(req, res)
}


exports.editarperfil = async (req, res) => {
  const ud = new UserDecorator(new EditarPerfil())
  return ud.ejecutar(req, res)
}
exports.follow = async (req, res) => {
  const f = new Follow()
  return f.ejecutar(req, res)
};
exports.usuarios = async (req, res) => {
  const ud = new UserDecorator(new Usuarios())
  return ud.ejecutar(req, res)
};

exports.unfollow = async (req, res) => {
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
    var sql = `DELETE FROM SEGUIDOS WHERE USER_seguidor= '${id_user}' AND USER_seguido= '${data.id_seguido}'`;
    const [rows] = await con.query(sql);
    res.statusCode = 200;
    res.json({ success: true, message: "Ya no sigue a este usuario." });
  } catch (error) {
    console.log(error);
    res.statusCode = 400;
    res.json({
      success: false,
      message: "Error al dejar de seguir al usuario, talvez ya lo sigue.",
    });
  }
}



