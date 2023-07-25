const supertest = require('supertest')
const app = require('../index')
const api = supertest(app)

describe('Manejo de canciones', ()=>{
    const idUser = 6;
    const idAlbum = 1;
    it('Obtener canciones de cierto album GET-200', async()=>{
        return api
        .get(`/getcanciones/${idUser}/${idAlbum}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
})