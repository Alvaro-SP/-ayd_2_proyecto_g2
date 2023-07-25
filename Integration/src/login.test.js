const { Builder, By, Key, until } = require('selenium-webdriver');
require('chromedriver');

async function testLoginComponent() {
  //const driver = await new Builder().forBrowser('chrome').build();
  const url = 'http://localhost:3000';
  try {
    let driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
    // -------------------------- REGISTRO de nuevo usuario--------------------------
    await driver.get(`${url}/registro`);
    //USUARIO
    const usuarioInputregistro = await driver.findElement(By.id('usuario'));
    await usuarioInputregistro.sendKeys('testuser');
    //NOMBRE
    const nombreInput = await driver.findElement(By.id('nombre'));
    await nombreInput.sendKeys('Test User');
    //CORREO
    const correoInput = await driver.findElement(By.id('correo'));
    await correoInput.sendKeys('testuser@gmail.com');
    //FECHA
    const fechaInput = await driver.findElement(By.id('fecha'));
    await fechaInput.sendKeys('19/11/2023');
    //PASSWORD
    const passwordInputregistro = await driver.findElement(By.id('pass'));
    await passwordInputregistro.sendKeys('123456');
    //CONFIRMAR PASSWORD
    const confpassInput = await driver.findElement(By.id('pass2'));
    await confpassInput.sendKeys('123456');
    await new Promise(resolve => setTimeout(resolve, 2000));
    //REGISTRARSE
    const registroButton = await driver.findElement(By.css('input[value="Registrarse"]'));
    await registroButton.sendKeys(Key.ENTER);


    await new Promise(resolve => setTimeout(resolve, 3000));

    //--------------LOGIN INCORRECTO--------------------------

    await driver.get(`${url}/login`);
    const usuarioInput = await driver.findElement(By.id('usuario'));
    await usuarioInput.sendKeys('edinmSv');

    const passwordInput = await driver.findElement(By.id('pass'));
    await passwordInput.sendKeys('1234S56');

    const loginButton = await driver.findElement(By.css('input[value="Login"]'));
    await loginButton.sendKeys(Key.ENTER);

    await new Promise(resolve => setTimeout(resolve, 3000));

    //--------------------------LOGIN CORRECTO--------------------------
    await driver.get(`${url}/login`);
    const usuarioInput2 = await driver.findElement(By.id('usuario'));
    await usuarioInput2.sendKeys('testuser');

    const passwordInput2 = await driver.findElement(By.id('pass'));
    await passwordInput2.sendKeys('123456');

    const loginButton2 = await driver.findElement(By.css('input[value="Login"]'));
    await loginButton2.sendKeys(Key.ENTER);


    await new Promise(resolve => setTimeout(resolve, 3000));

    //------------------------! CREAR ALBUM--------------------------
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

    //----------------------------ELIMINAR ALBUM--------------------------
    await driver.wait(until.urlIs(`${url}/usuario`));
    await new Promise(resolve => setTimeout(resolve, 3000));
    const closeButton = await driver.findElement(By.name('albumintegration'));
    await closeButton.click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const confirmButton = await driver.findElement(By.name('albumdel'));
    await confirmButton.click();
    await new Promise(resolve => setTimeout(resolve, 7000));

    //-----------------------------logout--------------------------
    await driver.wait(until.urlIs(`${url}/usuario`));
    const logoutButton = await driver.findElement(By.name('logout'));
    await logoutButton.click();
    //await new Promise(resolve => setTimeout(resolve, 000));
    await driver.wait(until.urlIs(`${url}/login`));
    console.log('Test passed');

    await driver.quit();


  } catch (error) {
    console.log(error);
  }


}

testLoginComponent();
