const mysql = require('mysql2')
const crypto = require('crypto');
var dotenv = require("dotenv");
const jwt = require('jsonwebtoken')
const EmailService = require("./Singleton")
dotenv.config();
const config = {
    host: process.env.MYSQL_HOSTNAME,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
}

var con = mysql.createConnection(config)


exports.prueba = async (req, res) => {
    res.send({ "Saludos": "Funciona la api del Usuario" })
}

exports.solicitudes = async (req, res) => {
    try {
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.status(400).jsonp({ Res: false })
            }
            c.query(`SELECT id, nombre, nickname, DATE_FORMAT(nacimiento,'%d/%m/%Y') as nacimiento FROM USER WHERE estado=0 AND tipo_usuario!=0;`,
                function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        c.end()
                        return res.status(400).jsonp({ Res: false })
                    }
                    return res.status(200).jsonp({ Res: true, Solicitudes: result })
                })
        })
    } catch (e) {
        console.log(e)
        res.status(400).jsonp({ Res: false })
    }
}

exports.usuarios = async (req, res) => {
    try {
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.status(400).jsonp({ Res: false })
            }
            c.query(`SELECT id, nombre, nickname, DATE_FORMAT(nacimiento,'%d/%m/%Y') as nacimiento FROM USER WHERE estado=1 AND tipo_usuario!=0;`,
                function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        c.end()
                        return res.status(400).jsonp({ Res: false })
                    }
                    return res.status(200).jsonp({ Res: true, Usuarios: result })
                })
        })
    } catch (e) {
        console.log(e)
        res.status(400).jsonp({ Res: false })
    }
}

exports.aceptar = async (req, res) => {
    try {
        const emailServiceInstance = EmailService.getInstance()
        const { id } = req.body
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.status(400).jsonp({ Res: false, Mensaje: "Error en la conexion a la db" })
            }

            c.query(`UPDATE USER SET estado = 1 WHERE id=${id};`,
                function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        c.end()
                        return res.status(400).jsonp({ Res: false, Mensaje: "Error en la conexion a la db 2" })
                    }

                    // correo
                    // desencriptar correo para realizar envio
                    c.query(`SELECT correo FROM USER WHERE id=${id};`,
                        async function (err, result, fields) {
                            if (err) {
                                console.log(err)
                                c.end()
                                return res.status(400).jsonp({ Res: false, Mensaje: "Error en la conexion a la db 2" })
                            }
                            let correo = result[0].correo
                            const decipher = crypto.createDecipheriv(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_KEY, process.env.CRYPTO_IV)
                            let decrypted = decipher.update(correo, 'hex', 'utf8')
                            decrypted += decipher.final('utf8');
                            var message = {
                                from: process.env.MAIL_USER,
                                to: decrypted,
                                subject: "Solicitud Aceptada",
                                text: "El administrador ha aceptado su solicitud de cuenta!",
                            }
                            const SendingEmail = await emailServiceInstance.sendEmail(message)
                            return res.status(200).jsonp({ Res: true })
                        })

                })
        })
    } catch (e) {
        console.log(e)
        res.status(400).jsonp({ Res: false })
    }
}

exports.denegar = async (req, res) => {
    try {
        const emailServiceInstance = EmailService.getInstance()
        const { id } = req.body
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.status(400).jsonp({ Res: false, Mensaje: "Error en la conexion a la db" })
            }

            c.query(`UPDATE USER SET estado = 2 WHERE id=${id};`,
                function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        c.end()
                        return res.status(400).jsonp({ Res: false, Mensaje: "Error en la conexion a la db 2" })
                    }
                    // correo
                    // desencriptar correo para realizar envio
                    c.query(`SELECT correo FROM USER WHERE id=${id};`,
                        async function (err, result, fields) {
                            if (err) {
                                console.log(err)
                                c.end()
                                return res.status(400).jsonp({ Res: false, Mensaje: "Error en la conexion a la db 2" })
                            }
                            let correo = result[0].correo
                            const decipher = crypto.createDecipheriv(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_KEY, process.env.CRYPTO_IV)
                            let decrypted = decipher.update(correo, 'hex', 'utf8')
                            decrypted += decipher.final('utf8');
                            var message = {
                                from: process.env.MAIL_USER,
                                to: decrypted,
                                subject: "Solicitud Denegada",
                                text: "El administrador ha denegado su solicitud de cuenta!",
                            }
                            const SendingEmail = await emailServiceInstance.sendEmail(message)
                            return res.status(200).jsonp({ Res: true })
                        })
                })
        })
    } catch (e) {
        console.log(e)
        res.status(400).jsonp({ Res: false })
    }
}

exports.dar_baja = async (req, res) => {
    try {
        const emailServiceInstance = EmailService.getInstance()
        const { id, mensaje } = req.body
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.status(400).jsonp({ Res: false, Mensaje: "Error en la conexion a la db" })
            }

            c.query(`UPDATE USER SET estado = 3 WHERE id=${id};`,
                function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        c.end()
                        return res.status(400).jsonp({ Res: false, Mensaje: "Error en la conexion a la db 2" })
                    }
                    // correo
                    // desencriptar correo para realizar envio
                    c.query(`SELECT correo FROM USER WHERE id=${id};`,
                        async function (err, result, fields) {
                            if (err) {
                                console.log(err)
                                c.end()
                                return res.status(400).jsonp({ Res: false, Mensaje: "Error en la conexion a la db 2" })
                            }
                            let correo = result[0].correo
                            const decipher = crypto.createDecipheriv(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_KEY, process.env.CRYPTO_IV)
                            let decrypted = decipher.update(correo, 'hex', 'utf8')
                            decrypted += decipher.final('utf8');
                            var message = {
                                from: process.env.MAIL_USER,
                                to: decrypted,
                                subject: "Tu cuenta ha sido dada de baja",
                                text: "El administrador ha dado de baja tu cuenta por los siguientes motivos:\n" + mensaje,
                            }
                            const SendingEmail = await emailServiceInstance.sendEmail(message)
                            return res.status(200).jsonp({ Res: true })
                        })
                })
        })
    } catch (e) {
        console.log(e)
        res.status(400).jsonp({ Res: false })
    }
}

exports.vertopsongs = async (req, res) => {
    var decoded;
    try {
        // Vamos a desencriptar nuestro objeto USUARIO ADMIN utilizando la llave con que fue creado:
        try {
            // Verificar y desencriptar el token
            decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
            // Los datos originales se encuentran en el objeto decoded
            console.log(decoded);
        } catch (error) {
            // console.error('Error al desencriptar el token: ', error);
            res.json({ error: 'Error al desencriptar el token' });
            return;
        }
        var sql = `SELECT * FROM mydb.CANCION ORDER BY no_reproducciones DESC;`
        con.query(sql, function (err, result, fields) {
            if (err) {
                res.statusCode = 400;
                res.json({ error: "Error al consultar los datos de Reportes." });
            } else {
                console.log("----------------datos consultados----------------")
                res.statusCode = 200;
                res.jsonp(result)
            }
        });

    } catch (error) {
        console.log(error)
        res.statusCode = 400;
        res.json({ error: "Error al consultar los datos de Reportes." });
    }
}

exports.vertopfollowers = async (req, res) => {
    const data = req.body; //! Suponiendo que los datos se envían en el cuerpo de la solicitud
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
            res.json({ error: 'Error al desencriptar el token' });
            return;
        }
        //!consultando
        /*
        Seleccionamos el id y nombre de los usuarios de la tabla USER.
        Hacemos un JOIN con la tabla SEGUIDOS utilizando la condición de igualdad u.id = s.USER_seguido para relacionar los usuarios con sus seguidores.
        Utilizamos la función de agregación COUNT(s.idSEGUIDOS) para contar el número de registros de la tabla SEGUIDOS que corresponden a cada usuario, y nos dará el número total de seguidores para cada usuario.
        Agrupamos los resultados por u.id y u.nombre para obtener el recuento de seguidores por usuario.
        Ordenamos los resultados en orden descendente según el total de seguidores.
        */
        var sql = ` SELECT u.id, u.nombre, u.nickname, COUNT(s.idSEGUIDOS) AS total_seguidores
                    FROM USER u
                    JOIN SEGUIDOS s ON u.id = s.USER_seguido
                    GROUP BY u.id, u.nombre
                    ORDER BY total_seguidores DESC;`;
        con.query(sql, function (err, result) {
            if (err) {
                console.log(err)
                res.statusCode = 400;
                res.json({ success: false, message: "Error al obtener los datos de Reportes." });
            } else {
                console.log("----------------datos consultados----------------")
                res.statusCode = 200;
                res.jsonp(result)
            }
        });
    } catch (error) {
        console.log(error);
        res.statusCode = 400;
        res.json({ success: false });
    }
};

exports.vertoptime = async (req, res) => {
    const data = req.body; //! Suponiendo que los datos se envían en el cuerpo de la solicitud
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
            res.json({ error: 'Error al desencriptar el token' });
            return;
        }
        //!consultando
        var sql = ` SELECT u.id, u.nombre, u.nickname, u.t_reproduccion AS tiempo_reproduccion
                    FROM USER u
                    ORDER BY tiempo_reproduccion DESC;`;
        con.query(sql, function (err, result) {
            if (err) {
                console.log(err)
                res.statusCode = 400;
                res.json({ success: false, message: "Error al obtener los datos de Reportes." });
            } else {
                console.log("----------------datos consultados----------------")
                res.statusCode = 200;
                res.jsonp(result)
            }
        });
    } catch (error) {
        console.log(error);
        res.statusCode = 400;
        res.json({ success: false });
    }
};
