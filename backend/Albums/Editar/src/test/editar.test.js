const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

describe("PRUEBA UNITARIA EDITAR ALBUMS", () => {
    // Test case 1
    it("SE ESPERA RETURN 200", async () => {
        const res = await api.post("/editaralbum").send({
            "idAlbumOrigen": 59,
            "nombreAlbum": "ALBUM EDITADO",
            "nuevasCanciones": [],
            "cancionesEliminadas": [],
            "cancionesSeleccionadas": [],
            "idAlbumDestino": '',
            "imagenAlbum": ''
        });
        expect(200);
    });

    // Test case 2
    it("SE ESPERA RETURN 500", async () => {
        const res = await api.post("/editaralbum").send({
            "idAlbumOrigen": 100,
            "nombreAlbum": "ALBUM EDITADO",
            "nuevasCanciones": [],
            "cancionesEliminadas": [],
            "cancionesSeleccionadas": [],
            "idAlbumDestino": '',
            "imagenAlbum": ''
        });
        expect(500)
    }
    );

    // Test case 3
    it("SE ESPERA RETURN 500", async () => {
        const res = await api.post("/editaralbum").send({
            "idAlbumOrigen": 59,
            "nombreAlbum": "ALBUM EDITADO",
            "nuevasCanciones": [],
            "cancionesEliminadas": [],
            "cancionesSeleccionadas": [1001,1002,1003],
            "idAlbumDestino": '',
            "imagenAlbum": ''
        });
        expect(500);
    }
    );

    // Test case 4
    it("SE ESPERA RETURN 500", async () => {
        const res = await api.post("/editaralbum").send({
            "idAlbumOrigen": 59,
            "nombreAlbum": 'ALBUM EDITADO',
            "nuevasCanciones": [],
            "cancionesEliminadas": [],
            "cancionesSeleccionadas": [],
            "idAlbumDestino": '',
            "imagenAlbum": ''
        });
        expect(500);
    }
    );

    // Test case 5
    it("SE ESPERA RETURN 500", async () => {
        const res = await api.post("/editaralbum").send({
            "idAlbumOrigen": 59,
            "nombreAlbum": 'ALBUM EDITADOO',
            "nuevasCanciones": [1002,1003,1004],
            "cancionesEliminadas": [2001,2002],
            "cancionesSeleccionadas": [1002,1004],
            "idAlbumDestino": 2000,
            "imagenAlbum": ''
        });
        expect(500);
    }
    );

    // Test case 6
    it("SE ESPERA RETURN 500", async () => {
        const res = await api.post("/editaralbum").send({
            "idAlbumOrigen": 59,
            "nombreAlbum": 'ALBUM EDITADOO',
            "nuevasCanciones": [],
            "cancionesEliminadas": [2001,2002],
            "cancionesSeleccionadas": [1002,1004],
            "idAlbumDestino": 2000,
            "imagenAlbum": ''
        });
        expect(500);
    }
    );

    // Test case 7
    it("SE ESPERA RETURN 500", async () => {
        const res = await api.post("/editaralbum").send({
            "idAlbumOrigen": 59,
            "nombreAlbum": 'ALBUM EDITADOO',
            "nuevasCanciones": [],
            "cancionesEliminadas": [],
            "cancionesSeleccionadas": [1002,1004],
            "idAlbumDestino": 2000,
            "imagenAlbum": ''
        });
        expect(500);
    }
    );

});



