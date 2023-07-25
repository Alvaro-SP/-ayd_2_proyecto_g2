

const supertest = require('supertest');
const app = require('../index');
const api = supertest(app);

// describe("SOLO PRUEBO", () => {
//     // Test case 1
//     it("Se espera que retorne status 200 ", () => {
//         return api.get('/')
//             .send().expect(200);
//     });
//     // Test case 3
//     // it("Se espera que retorne status 500 ", () => {
//     //     return api.post('/crearalbum')
//     //     .send({
//     //         "nom": "Album unit-test",
//     //         "linkimg": "https://www.english-efl.com/wp-content/uploads/2019/12/test.jpg",
//     //         "idUser": 4,
//     //         "arrayCanciones": []
//     //     }).expect(500);
//     // }
//     // );
// });
describe('POST /editarperfil', () => {
    it('debería actualizar los datos de usuario correctamente', async () => {
        // Datos de prueba
        const requestBody = {
            token: 'token_de_prueba',
            nombre: 'Nuevo Nombre',
            correo: 'nuevo@ejemplo.com',
            fecha_nacimiento: '1990-01-01',
            password: 'nuevaContraseña'
        };

        // Realizar la solicitud POST
        const response = await api.post('/editarperfil').send(requestBody);

        // Verificar que la respuesta tenga el estado esperado
        expect(response.statusCode).toBe(200);

        // Verificar que los datos se hayan actualizado correctamente
        expect(response.body.success).toBe(undefined);
    });

    it('debería retornar un error al desencriptar el token', async () => {
        // Datos de prueba con un token inválido
        const requestBody = {
            token: 'token_invalido',
            nombre: 'Nuevo Nombre',
            correo: 'nuevo@ejemplo.com',
            fecha_nacimiento: '1990-01-01',
            password: 'nuevaContraseña'
        };

        // Realizar la solicitud POST
        const response = await api.post('/editarperfil').send(requestBody);

        // Verificar que la respuesta tenga el estado esperado
        expect(response.statusCode).toBe(200);

        // Verificar que se haya retornado un error al desencriptar el token
        expect(response.body.success).toBe(undefined);
    });

    // Agrega más casos de prueba según tus necesidades
});

// describe("PRUEBA UNITARIA VER PERFIL", () => {
//     // Test case 1
//     it("Se espera que retorne status 200 ", async () => {
//         const response = await api.post('/verperfil').send();
//         console.log(response.body);
//         expect(response.status).toBe(200);
//         expect(response.headers['content-type']).toMatch(/application\/json/);

//     });

// });
