const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

//settings
app.set('port', process.env.PORT || 3010);

//middlewares
app.use(bodyParser.json({ limit: '50mb' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());


app.use(require('./functions/middleware'));

module.exports = app;