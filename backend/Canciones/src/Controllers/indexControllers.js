const mysql = require('mysql2/promise');
const dbconf = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}

exports.prueba = async (req, res) => {
    res.send({ "Saludos": "Funciona la api" })
}

exports.Canciones_Album = async (req, res) => {
    const data = req.params;
    var con = await mysql.createConnection(dbconf);

    try {
        var sql = `CALL Canciones_Album('${data.id_user}', '${data.id_album}');`
        const [result] = await con.query(sql)

        if (result[0][0].hasOwnProperty("error")) {
            res.statusCode = 400;
            res.jsonp()
            await con.end();
        }else{
            res.statusCode = 200;
            res.jsonp(result[0])
            await con.end();
        }
        
    } catch (error) {
        console.log(error)
        res.statusCode = 400;
    }
}

exports.Cancion = async (req, res) => {
    const data = req.params;
    var con = await mysql.createConnection(dbconf);

    try {
        var sql = `CALL Cancion('${data.id_user}', '${data.id_album}', '${data.id_cancion}');`
        const [result] = await con.query(sql)

        if (result[0][0].hasOwnProperty("error")) {
            res.statusCode = 400;
            res.jsonp()
            await con.end();
        }else{
            res.statusCode = 200;
            res.jsonp(result[0])
            await con.end();
        }
    } catch (error) {
        console.log(error)
        res.statusCode = 400;
    }
}

exports.CancionesSinAlbum = async (req, res) => {
    const data = req.params;
    var con = await mysql.createConnection(dbconf);

    try {
        var sql = `CALL getCanciones();`
        const [result] = await con.query(sql)

        if (result[0][0].hasOwnProperty("error")) {
            res.statusCode = 400;
            res.jsonp()
            await con.end();
        }else{
            res.statusCode = 200;
            res.jsonp(result[0])
            await con.end();
        }
    } catch (error) {
        console.log(error)
        res.statusCode = 400;
    }
}

exports.addInfoCanciones = async (req, res) => {
    const data = req.body;
    var con = await mysql.createConnection(dbconf);
    console.log(data);
    try {
        var sql = `UPDATE USER SET t_reproduccion = t_reproduccion + ${data.minutos} WHERE id = ${data.id_usuario};`
        const [result] = await con.query(sql)
        console.log("Tiempo actualizado");
    
    } catch (error) {
        console.log(error)
    }

    await data.canciones.forEach( async element => {
        try {
            var sql = `UPDATE CANCION SET no_reproducciones = no_reproducciones + ${element.veces} WHERE idCANCION = ${element.id_cancion};`
            const [result] = await con.query(sql)
            console.log("Reproducciones de " + element.id_cancion)

        } catch (error) {
            console.log(error)
        }
    });

    res.jsonp({ res: "ok" })
}

/* let cuerpo = {
            ext: this.state.ext,
            name: this.state.name,
            base64: aux[1],
            id

        } */



const amazonS3Config={
    ccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
}
const CloudStorageFactory=require('./CloudStorageFactory')
const amazonS3provider=CloudStorageFactory.createProvider('AmazonS3',amazonS3Config)

exports.subirCanciones = async (req, res) => {
    var con = await mysql.createConnection(dbconf);
    try {
        const { ext, name, base64, id } = req.body
        amazonS3provider.connect();
       const url_song = await amazonS3provider.upload(base64, ext);

        var sql = `INSERT INTO CANCION(nombre_cancion, link, extension, fecha, no_reproducciones) 
                VALUES ('${name}', '${url_song}', '${ext}', now(), 0);`;

        const [result] = await con.query(sql)

        res.statusCode = 200;
        res.jsonp({ Res: true })
        await con.end();
        

    } catch (error) {
        console.log(error)
        res.status(400).jsonp({ Res: false })
        return error;
    }
}
