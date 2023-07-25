const { Builder, By, until, Key } = require('selenium-webdriver');
const { expect } = require('chai');


const USERNAME = "2181781580101";
const KEY = "7cncfVnOOXNgIRmaWpgStOYZXnn2HhdUWGQWJNqh9KQjbzZGcl";


const url = 'http://34.70.76.166:3000';
const GRID_HOST = 'hub.lambdatest.com/wd/hub';

const datosUser = [
    {
        usuario: 'testuser',
        nombre: 'Test User',
        correo: 'testuser@gmail.com',
        fecha: '19/11/2023',
        telefono: 12345678,
        password: '123456',
    }
]


// Setup Input capabilities
const capabilities = {
    "browserName": "Chrome",
    "browserVersion": "114.0",
    "LT:Options": {
        "username": "2181781580101",
        "accessKey": "7cncfVnOOXNgIRmaWpgStOYZXnn2HhdUWGQWJNqh9KQjbzZGcl",
        "platformName": "Windows 10",
        "project": "Untitled",
        "w3c": true,
        "plugin": "node_js-node_js"
    }

}

const gridUrl = 'https://' + USERNAME + ':' + KEY + '@' + GRID_HOST;
describe('webdriver', () => {
    const driver = new Builder()
        .usingServer(gridUrl)
        .withCapabilities(capabilities)
        .build();

    it('Registro de usuario', async () => {
        await driver.get(`${url}/registro`);
        //USUARIO
        const usuarioInputregistro = await driver.findElement(By.id('usuario'));
        await usuarioInputregistro.sendKeys('testuser');
        //NOMBRE
        const nombreInput = await driver.findElement(By.id('nombre'));
        await nombreInput.sendKeys(datosUser[0].nombre);
        //CORREO
        const correoInput = await driver.findElement(By.id('correo'));
        await correoInput.sendKeys(datosUser[0].correo);
        //FECHA
        const fechaInput = await driver.findElement(By.id('fecha'));
        await fechaInput.sendKeys(datosUser[0].fecha);
        //telefono
        const telefonoInput = await driver.findElement(By.id('telefono'));
        await telefonoInput.sendKeys(datosUser[0].telefono);
        //PASSWORD
        const passwordInputregistro = await driver.findElement(By.id('pass'));
        await passwordInputregistro.sendKeys(datosUser[0].password);
        //CONFIRMAR PASSWORD
        const confpassInput = await driver.findElement(By.id('pass2'));
        await confpassInput.sendKeys(datosUser[0].password);
        await new Promise(resolve => setTimeout(resolve, 2000));
        //REGISTRARSE
        const registroButton = await driver.findElement(By.css('input[value="Registrarse"]'));
        await registroButton.sendKeys(Key.ENTER);

        console.log('********** Test passed en registro *******************');
        console.log('** Se agregaron los datos de registro correctamente **');
        console.log('******************************************************\n');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // const msg = await driver.getCurrentUrl();
        // expect(msg).to.equal(`${url}/login`);
    });

    it('Login de usuario con user invalido', async () => {
        await driver.get(`${url}/login`);
        const usuarioInput = await driver.findElement(By.id('usuario'));
        await usuarioInput.sendKeys('edinmSv');

        const passwordInput = await driver.findElement(By.id('pass'));
        await passwordInput.sendKeys('1234S56');

        const loginButton = await driver.findElement(By.css('input[value="Login"]'));
        await loginButton.sendKeys(Key.ENTER);

        console.log('********** Test passed en login **********************');
        console.log('*** Se ingresaron los datos de login incorrectos *****');
        console.log('******************************************************\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
        const msg = await driver.getCurrentUrl();
        expect(msg).to.equal(`${url}/login`);
    });

    it('Login de usuario con user valido', async () => {
        await driver.get(`${url}/login`);
        const usuarioInput = await driver.findElement(By.id('usuario'));
        await usuarioInput.sendKeys(datosUser[0].usuario);
        const passwordInput = await driver.findElement(By.id('pass'));
        await passwordInput.sendKeys(datosUser[0].password);
        const loginButton = await driver.findElement(By.css('input[value="Login"]'));
        await loginButton.sendKeys(Key.ENTER);

        console.log('********** Test passed en login **********************');
        console.log('*** Se ingresaron los datos de login correctos *******');
        console.log('******************************************************\n');

        await new Promise(resolve => setTimeout(resolve, 3000));
        const msg = await driver.getCurrentUrl();
        expect(msg).to.equal(`${url}/usuario`);
    });

    it('Crear album', async () => {
        // irnos a la seccion de crear Album en el Navbar
        await driver.wait(until.urlIs(`${url}/usuario`));
        const crearAlbumButton = await driver.findElement(By.name('crearalbumgood'));
        await crearAlbumButton.click();
        // setear nombre de albumm en el input
        await driver.wait(until.urlIs(`${url}/crearalbum`));
        const nameAlbumInput = await driver.findElement(By.name('nombrealbumgood'));
        await nameAlbumInput.sendKeys('albumintegration');
        // waiting for 2 secs
        await new Promise(resolve => setTimeout(resolve, 2000));
        //ahora guardo los cambios
        const guardaralbum = await driver.findElement(By.name('Guardarcambiosalbum'));
        await guardaralbum.click();
        // waiting for 4 secs
        await new Promise(resolve => setTimeout(resolve, 4000));
        //verifico que se creo el album
        const msg = await driver.getCurrentUrl();
        expect(msg).to.equal(`${url}/usuario`);
    });

    it('Eliminar album', async () => {
        await driver.wait(until.urlIs(`${url}/usuario`));
        await new Promise(resolve => setTimeout(resolve, 3000));
        const closeButton = await driver.findElement(By.name('albumintegration'));
        await closeButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        const confirmButton = await driver.findElement(By.name('albumdel'));
        await confirmButton.click();
        await new Promise(resolve => setTimeout(resolve, 7000));
        const msg = await driver.getCurrentUrl();
        expect(msg).to.equal(`${url}/usuario`);
    });


});
