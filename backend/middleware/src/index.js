const app = require('./app');
app.listen(app.get('port'));
console.log('Middleware on port', app.get('port'));