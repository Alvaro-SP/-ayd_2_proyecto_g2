const mysql = require('mysql');


const connection = mysql.createConnection({
    host: '34.132.216.220',
    user: 'root',
    password: 'Pokemon*150',
    database: 'mydb',
    port: 3306
});

connection.connect(function(err){
    if(err){
        console.log('Error en la conexion de db ' + err.stack);
        return;
    }else{
        console.log('DB is connected and id is ' + connection.threadId);
    }
});


module.exports = connection;

/*
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
*/