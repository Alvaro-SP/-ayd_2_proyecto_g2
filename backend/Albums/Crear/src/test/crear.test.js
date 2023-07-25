const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

describe("PRUEBA UNITARIA CREAR ALBUMS", () => {
    // Test case 1
    it("Se espera que retorne status 200 ", () => {
        return api.post('/crearalbum')
            .send({
                "nom": "Album unit-test",
                "linkimg": "https://www.english-efl.com/wp-content/uploads/2019/12/test.jpg",
                "idUser": 4,
                "arrayCanciones": []
            }).expect(200);
    });

    // Test case 2
    it("Se espera que retorne status 500 ", () => {
        return api.post('/crearalbum')
            .send({
                "nom": "Album unit-test",
                "linkimg": "https://www.english-efl.com/wp-content/uploads/2019/12/test.jpg",
                "idUser": 1000,
                "arrayCanciones": []
            }).expect(500);
    }
    );
    // // Test case 3
    it("Se espera que retorne status 500 ", () => {
        return api.post('/crearalbum')
            .send({
                "nom": "Album unit-test",
                "linkimg": "https://www.english-efl.com/wp-content/uploads/2019/12/test.jpg",
                "idUser": 4,
                "arrayCanciones": []
            }).expect(500);
    }
    );
});



