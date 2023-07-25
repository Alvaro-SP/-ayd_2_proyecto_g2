const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const app = express()
const bodyParser = require('body-parser');
const rutas = require("./Routes/routerController")
app.use(bodyParser.json({ limit: '50mb' }));
app.set('port', process.env.SERVER_PORT || 3003);
app.use(morgan('dev')); 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true  }));
app.use(cors());

app.listen(app.get('port'), () => {
    console.log('Server On Port ', app.get('port'))
});

app.use("/", rutas);

module.exports = app;