
const AbstractController = require('./AbstractController')

class UserDecorator extends AbstractController {
    constructor(accion) {
        super()
        this.accion = accion
    }

    async ejecutar(req, res) {
        console.log("Estamos decorando siu")
        return this.accion.ejecutar(req, res)
    }
}

module.exports = UserDecorator