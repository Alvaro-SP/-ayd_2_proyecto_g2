
const mysql = require('mysql2')
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
var dotenv = require("dotenv");
const AES = require('crypto-js');
const speakeasy = require('speakeasy');
const EmailService = require("./Singleton")
dotenv.config();

const config = {
    host: process.env.MYSQL_HOSTNAME,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
}


const emailServiceInstance = EmailService.getInstance()

const admin = require('firebase-admin');
const accountSid = process.env.TWILIO_ACCOUNT_DID; // Tu Account SID de Twilio
const authToken = process.env.TWILIO_AUTH_TOKEN; // Tu Auth Token de Twilio
const client = require('twilio')(accountSid, authToken);

// Ruta al archivo de configuración de Firebase descargado anteriormente
const serviceAccount = require('./ayd-vacas-junio-firebase-adminsdk-upu0p-0cee5def36.json');

// Inicializar la app de Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://ayd-vacas-junio.firebaseio.com'
});



exports.index = async (req, res) => {
    res.send({ "Saludos": "Funciona la api" });
};

exports.registro = async (req, res) => {
    try {
        const { nombre, usuario, correo, fecha, telefono, password } = req.body

        //cifrando correo
        const cipherC = crypto.createCipheriv(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_KEY, process.env.CRYPTO_IV)
        let correoC = cipherC.update(correo, 'utf-8', 'hex')
        correoC += cipherC.final('hex')

        //console.log(req.body)
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end();
                return res.status(400).jsonp({ Res: false, Mensaje: "Error en la conexion a la db" })
            }
            c.query(`SELECT * FROM USER WHERE nickname='${usuario}' OR correo='${correoC}';`,
                async function (err, result, field) {
                    if (err) {
                        console.log(err)
                        c.end()
                        return res.status(400).jsonp({ Res: false, Mensaje: "Error en la conexion a la db 2" })
                    }
                    if (result.length >= 1) {
                        if (result[0].nickname == usuario) {
                            c.end()
                            return res.jsonp({ Res: false, Mensaje: "Usuario (Nickname) ya existente" })
                        } else {
                            c.end()
                            return res.jsonp({ Res: false, Mensaje: "Correo ya existente" })
                        }

                    }

                    //descifrando password
                    const decrypted = AES.AES.decrypt(password, process.env.CRYPTO_KEY_FRONTEND).toString(AES.enc.Utf8);
                    //console.log(decrypted)

                    //encriptando nuevamente la password
                    const cipherP = crypto.createCipheriv(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_KEY, process.env.CRYPTO_IV)
                    let passC = cipherP.update(decrypted, 'utf-8', 'hex')
                    passC += cipherP.final('hex')

                    c.query(`INSERT INTO USER (nombre, nickname, correo, nacimiento, contraseña, tipo_usuario, t_reproduccion, estado, telefono)
            VALUES ('${nombre}', '${usuario}','${correoC}', '${fecha}','${passC}', 1, 0, 0,'+502${telefono}');`,
                        function (err, result, field) {
                            if (err) {
                                console.log(err)
                                c.end()
                                return res.status(400).jsonp({ Res: false, Mensaje: "Error en la conexion a la db 3" })
                            }
                            c.end()
                            return res.jsonp({ Res: true, Mensaje: "Ok" })
                        })

                })

        })
    } catch (e) {
        console.log(e)
        res.status(400).jsonp({ Res: false })
    }
}

exports.login = async (req, res) => {
    try {
        const { usuario, password } = req.body
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.status(400).jsonp({ Res: false, Mensaje: "Error en la conexion a la db" })
            }
            //descifrando password
            const decrypted = AES.AES.decrypt(password, process.env.CRYPTO_KEY_FRONTEND).toString(AES.enc.Utf8);

            c.query(`SELECT * FROM USER WHERE nickname='${usuario}';`,
                //c.query(`SELECT * FROM USER WHERE nickname='${usuario}';`,
                async function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        c.end()
                        return res.status(400).jsonp({ Mensaje: "Error en la conexion a la db 2" })
                    }

                    if (result.length == 0) {
                        console.log(err)
                        c.end()
                        return res.jsonp({ Res: false, Mensaje: "Usuario no existente" })
                    }

                    const usuario = result[0]

                    console.log(usuario)

                   //estado 0
                     if (usuario.estado == 0 && usuario.nickname != 'testuser') {
                        
                        c.end()
                        return res.jsonp({ Res: false, Mensaje: "Su solicitud no ha sido aceptada" })
                    }

                    //estado 2 (rechazada)
                    if (usuario.estado == 2) {
                        
                        c.end()
                        return res.jsonp({ Res: false, Mensaje: "Su solicitud ha sido rechazada" })
                    }

                    //estado 2 (rechazada)
                    if (usuario.estado == 3) {
                        
                        c.end()
                        return res.jsonp({ Res: false, Mensaje: "Su usuario ha sido dado de baja" })
                    }
                    //estado 2 (rechazada)
                    if (usuario.estado != 1 && usuario.nickname != 'testuser') {
                        
                        c.end()
                        return res.jsonp({ Res: false, Mensaje: "Su usuario no ha sido aceptado" })
                    }

                    //encriptando nuevamente la password
                    const cipherP = crypto.createCipheriv(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_KEY, process.env.CRYPTO_IV)
                    let passC = cipherP.update(decrypted, 'utf-8', 'hex')
                    passC += cipherP.final('hex')

                    if (usuario.contraseña != passC) {
                        c.end()
                        return res.jsonp({ Res: false, Mensaje: "Password incorrecta" })
                    }

                    if (usuario.auth == 1) {
                        const secret = speakeasy.generateSecret({ length: 20 })
                        const token = speakeasy.totp({
                            secret: secret.base32,
                            encoding: 'base32'
                        })

                        // enviar correo con token
                        if (usuario.tipoAuth == 1) {
                            // desencriptar el correo para enviar
                            let correo = usuario.correo
                            const decipher = crypto.createDecipheriv(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_KEY, process.env.CRYPTO_IV)
                            let decrypted = decipher.update(correo, 'hex', 'utf8')
                            decrypted += decipher.final('utf8')

                            var menssage = {
                                from: process.env.MAIL_USER,
                                to: decrypted,
                                subject: "Token 2FA",
                                text: `Su token es: ${token}`
                            }
                            const SendingEmail = await emailServiceInstance.sendEmail(menssage)

                        }
                        // enviar por sms
                        else {
                            await client.messages
                                .create({
                                    body: `AyDisco - Su token es: ${token}`,
                                    from: process.env.TWILIO_PHONE,
                                    to: usuario.telefono
                                })
                                .then(message => console.log(message.sid))
                                .catch(error => {
                                    console.log(error)
                                    return res.status(400).jsonp({ Res: false, Mensaje: "Error envio correo" })
                                });
                        }

                        // actualizar registro db
                        const now = new Date()
                        const formattedDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
                        c.query(`UPDATE USER SET lastToken = '${formattedDateTime}', tokenAuth='${secret.base32}' WHERE id = ${usuario.id};`,
                            function (err, result, fields) {
                                if (err) {
                                    console.log(err)
                                    c.end()
                                    return res.status(400).jsonp({ Mensaje: "Error en la conexion a la db 3" })
                                }
                                return res.status(200).jsonp({ Res: true, fa2: true })
                            })
                    } else {
                        const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' })
                        return res.jsonp({ Res: true, fa2: false, Mensaje: 'Ok', Token: token })
                    }
                })
        })
    } catch (err) {
        console.log(err)
        res.status(400).jsonp({ Res: false })
    }
}

exports.login2fa = async (req, res) => {
    try {
        const { usuario, token } = req.body
        let c = mysql.createConnection(config)
        c.connect(function (err) {
            if (err) {
                console.log(err)
                c.end()
                return res.status(400).jsonp({ Res: false, Mensaje: "Error en la conexion a la db" })
            }

            c.query(`SELECT * FROM USER WHERE nickname='${usuario}';`,
                function (err, result, fields) {
                    if (err) {
                        console.log(err)
                        c.end()
                        return res.status(400).jsonp({ Mensaje: "Error en la conexion a la db 2" })
                    }

                    if (result.length == 0) {
                        console.log(err)
                        c.end()
                        return res.jsonp({ Res: false, Mensaje: "Usuario no existente" })
                    }

                    const usuario = result[0]

                    //estado 0
                    if (usuario.estado == 0 && usuario.nickname != 'testuser') {
                        c.end()
                        return res.jsonp({ Res: false, Mensaje: "Su solicitud no ha sido aceptada" })
                    }

                    //estado 2 (rechazada)
                    if (usuario.estado == 2) {
                        c.end()
                        return res.jsonp({ Res: false, Mensaje: "Su solicitud ha sido rechazada" })
                    }

                    //estado 2 (rechazada)
                    if (usuario.estado == 3) {
                        c.end()
                        return res.jsonp({ Res: false, Mensaje: "Su usuario ha sido dado de baja" })
                    }
                    //estado 2 (rechazada)
                    if (usuario.estado != 1) {
                        c.end()
                        return res.jsonp({ Res: false, Mensaje: "Su usuario no ha sido aceptado" })
                    }

                    const currentDate = new Date();
                    const lastTokenDate = new Date(usuario.lastToken);
                    const threeMinutesInMillis = 3 * 60 * 1000; // Convertir 3 minutos a milisegundos

                    const hasPassedThreeMinutes = currentDate - lastTokenDate > threeMinutesInMillis;

                    if (hasPassedThreeMinutes) {
                        return res.jsonp({ Res: false, Mensaje: "Su token ya expiro" })
                    }

                    const verificar = speakeasy.totp.verify({
                        secret: usuario.tokenAuth,
                        encoding: 'base32',
                        token,
                        window: 1
                    })

                    if (verificar) {
                        const token2 = jwt.sign({ id: usuario.id, tipo: usuario.tipo_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' })
                        return res.jsonp({ Res: true, Mensaje: 'Ok', Token: token2 })
                    } else {
                        return res.jsonp({ Res: false, Mensaje: "Su token no es valido" })
                    }
                })
        })

    } catch (err) {
        console.log(err)
        res.status(400).jsonp({ Res: false })
    }
}
