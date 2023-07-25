const db = require('../db/conexion');
function crearLog(middleware, entrada, salida, esError) {
    const log = {
        Middleware: middleware,
        Entrada: entrada,
        Salida: salida,
        EsError: esError
    };
    console.log("log: ", log);
    const sql1 = `CALL crearLog(?,?,?,?)`;
    const result = db.query(sql1, [log.Middleware, JSON.stringify(log.Entrada), JSON.stringify(log.Salida), log.EsError]);
    console.log("log: ", log);
    console.log("result: ", result);
}

async function middleware(req, res, next) {
    if (req.query.api == "album") {
        if (req.query.id == "crear") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(process.env.MICROSERVICE_CREAR, {
                    method: 'POST',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog("album-crear", req.body, json, false);
                res.json(json);
            } catch (error) {
                crearLog('album-crear', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                console.error(error);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
                return;
            }
        } else if (req.query.id == "listar") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(process.env.MICROSERVICE_LISTAR, {
                    method: 'POST',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog("album-listar", req.body, json, false);
                res.json(json);
            } catch (error) {
                crearLog('album-listar', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                console.error(error);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        } else if (req.query.id == "eliminar") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(process.env.MICROSERVICE_ELIMINAR, {
                    method: 'POST',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog("album-eliminar", req.body, json, false);
                res.json(json);
            } catch (error) {
                crearLog('album-eliminar', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                console.error(error);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        } else if (req.query.id == "editar") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(process.env.MICROSERVICE_EDITAR, {
                    method: 'POST',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog("album-editar", req.body, json, false);
                res.json({ data: 'success' });
            } catch (error) {
                crearLog('album-editar', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                console.error(error);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        }
    } else if (req.query.api == "cancion") {
        if (req.query.id == "canciones") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(process.env.MICROSERVICE_CANCIONESALBUMS + "/" + req.query.id_user + "/" + req.query.id_album, {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('cancion-canciones', req.body, json, false);
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('cancion-canciones', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        } else if (req.query.id == "cancion") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(process.env.MICROSERVICE_CANCION + "/" + req.query.id_user + "/" + req.query.id_album + "/" + req.query.id_cancion, {
                    method: 'GET',

                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('cancion-cancion', req.body, json, false);
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('cancion-cancion', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        } else if (req.query.id == "sinalbum") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(process.env.MICROSERVICE_CANCIONSINALBUM, {
                    method: 'GET',
                    headers: {
                        'Cache-Control': 'no-store' // Deshabilitar la caché
                    }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('cancion-sinalbum', req.body, json, false);
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('cancion-sinalbum', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        } else if (req.query.id == "infocanciones") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(process.env.MICROSERVICE_INFOCANCIONES, {
                    method: 'POST',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('cancion-infocanciones', req.body, json, false);
                res.json({ data: 'success' });
            } catch (error) {
                console.error(error);
                crearLog('cancion-infocanciones', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        } else if (req.query.id == "subircancion") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(process.env.MICROSERVICE_SUBIRCANCIONES, {
                    method: 'POST',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('cancion-subircancion', req.body, json, false);
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('cancion-subircancion', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        }

    } else if (req.query.api == "usuario") {
        //aquí va el código para la api de usuario
        if (req.query.id == "profile") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(`${process.env.SERVICE_USUARIO}/verperfil`, {
                    method: 'POST',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('usuario-profile', req.body, json, false);
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('usuario-profile', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        } else if (req.query.id == "editprofile") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(`${process.env.SERVICE_USUARIO}/editarperfil`, {
                    method: 'POST',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('usuario-editprofile', req.body, json, false);
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('usuario-editprofile', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        } else if (req.query.id == "follow") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(`${process.env.SERVICE_USUARIO}/follow`, {
                    method: 'POST',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('usuario-follow', req.body, json, false);
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('usuario-follow', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        } else if (req.query.id == "usuarios") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(`${process.env.SERVICE_USUARIO}/usuarios`, {
                    method: 'POST',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('usuario-usuarios', req.body, json, false);
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('usuario-usuarios', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        }
        else if (req.query.id == "unfollow") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(`${process.env.SERVICE_USUARIO}/unfollow`, {
                    method: 'POST',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('usuario-unfollow', req.body, json, false);
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('usuario-unfollow', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        } 

    } else if (req.query.api == "loginflow") {
        if (req.query.id == "registro") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(`${process.env.SERVICE_LOGINFLOW}/registro`, {
                    method: 'POST',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog("LoginFlow-registro", req.body, json, json.Res)
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('LoginFlow-registro', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        } else if (req.query.id == "login") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(`${process.env.SERVICE_LOGINFLOW}/login`, {
                    method: 'POST',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('LoginFlow-login', req.body, json, json.Res);
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('LoginFlow-login', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        } else if (req.query.id == "login2fa") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(`${process.env.SERVICE_LOGINFLOW}/login2fa`, {
                    method: 'POST',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('LoginFlow-login2fa', req.body, json, json.Res);
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('LoginFlow-login2fa', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        }
    } else if (req.query.api == "admin") {
        if (req.query.id == "solicitudes") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(`${process.env.SERVICE_ADMIN}/solicitudes`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('admin-solicitudes', req.body, json, json.Res);
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('admin-solicitudes', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        } else if (req.query.id == "usuarios") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(`${process.env.SERVICE_ADMIN}/usuarios`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('admin-usuarios', req.body, json, json.Res);
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('admin-usuarios', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        } else if (req.query.id == "aceptar") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(`${process.env.SERVICE_ADMIN}/aceptar`, {
                    method: 'PATCH',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('admin-aceptar', req.body, json, json.Res);
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('admin-aceptar', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        } else if (req.query.id == "rechazar") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(`${process.env.SERVICE_ADMIN}/rechazar`, {
                    method: 'PATCH',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('admin-rechazar', req.body, json, json.Res);
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('admin-rechazar', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        } else if (req.query.id == "dar_baja") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(`${process.env.SERVICE_ADMIN}/dar_baja`, {
                    method: 'PATCH',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('admin-dar_baja', req.body, json, json.Res);
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('admin-dar_baja', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        } else if (req.query.id == "topsongs") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(`${process.env.SERVICE_ADMIN}/vertopsongs`, {
                    method: 'POST',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('admin-topsongs', req.body, json, false);
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('admin-topsongs', req.body, { salida_error: 'Error de conexión con el servidor' }, true);

                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        } else if (req.query.id == "topfollowers") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(`${process.env.SERVICE_ADMIN}/vertopfollowers`, {
                    method: 'POST',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('admin-topfollowers', req.body, json, false);
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('admin-topfollowers', req.body, { salida_error: 'Error de conexión con el servidor' }, true);

                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        } else if (req.query.id == "toptimelisten") {
            try {
                const fetch = await import('node-fetch');
                const response = await fetch.default(`${process.env.SERVICE_ADMIN}/vertoptime`, {
                    method: 'POST',
                    body: JSON.stringify(req.body),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Error de conexión con el servidor');
                }

                const json = await response.json();
                console.log(json);
                crearLog('admin-toptimelisten', req.body, json, false);
                res.json(json);
            } catch (error) {
                console.error(error);
                crearLog('admin-toptimelisten', req.body, { salida_error: 'Error de conexión con el servidor' }, true);
                res.status(500).json({ error: 'Error de conexión con el servidor' });
            }
        }
    }
}

module.exports = middleware;
