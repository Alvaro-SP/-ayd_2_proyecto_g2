const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');


// Settings
app.set('port', process.env.SERVER_PORT || 3003);
app.set('json spaces', 2);


// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());


// Default Routes
app.use('/', require('./routes/index'));


// Routes
app.use('/api/', require('./routes/album'));
app.use('/api/', require('./routes/song'));


// Starting the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});