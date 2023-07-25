const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const app = express();
//configuracion
app.set('port', process.env.SERVER_PORT || 3004);
//middlewars
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

//routes
app.use(require('./routes/eliminar'));

module.exports = app;
