
const AbstractController = require('./AbstractController')
class Prueba extends AbstractController {
    constructor() { super() }

    async ejecutar(rea, res) {
        return res.send({ Saludos: "Funciona la api del Usuario" });
    }
}

module.exports = Prueba
