const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

describe("PRUEBA UNITARIA CREAR ALBUMS", () => {
    // Test case 1
    it("Se espera que retorne status 200 ", () => {
        return api.post('/eliminaralbums')
        .send({
            "idAlbum":60
        }).expect(200);
    });

    // Test case 2
    it("Se espera que retorne status 500 ", () => {
        return api.post('/eliminaralbums')
        .send({
            "idAlbum":null
        }).expect(500);
    }
    );

    // Test case 3
    it("Se espera que retorne status 500 ", () => {
        return api.post('/eliminaralbums')
        .send({
            "idAlbum":""
        }).expect(500);
    }
    );
});



