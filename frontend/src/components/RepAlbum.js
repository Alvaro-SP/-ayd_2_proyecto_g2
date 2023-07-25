import { Container, Grid } from "@mui/material";
import React, { Component, useState, useEffect } from "react";
import { BarraUsuario } from './BarraUsuario'
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReproductorMusica from './Player';
import axios from 'axios';
import { Howl, Howler } from 'howler';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default function ReproductorAlbum() {
    const [logItems, initLog] = useState([])
    const [prim, setprim] = useState(true)
    var datosAlbum = { id_usuario: 0, id_album: 0 };

    if (prim) {
        var jsDatos = cookies.get('jsdatos')
        if (jsDatos === undefined) {
            cookies.set('jsdatos', { id_usuario: 0, minutos: 0, canciones: [] }, { path: window.location.pathname });
        }
    }

    const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const verificarRol = (token) => {
        const Tipo = jwt_decode(token);
        const expiracion = Tipo.exp
        console.log(Tipo)
        if (expiracion < Date.now() / 1000) {
            sessionStorage.clear()
            toast.warning('Su sesion ha expirado', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
            setTimeout(() => {
                window.location.href = "/login"
            }, 3000)
        }
        if (Tipo.tipo != 1) {
            window.location.href = "/accessDenied"

        }
    }

    const fetchData = async () => {
        const url = `${process.env.REACT_APP_API_URL}api=cancion&id=canciones&id_user=${datosAlbum.id_usuario}&id_album=${datosAlbum.id_album}`
        const response = await axios.get(url)
        return response.data
    }

    useEffect(() => {
        const handleBeforeUnload = async (event) => {
            event.preventDefault();

            try {
                await sendDatos(); // Esperar a que sendDatos() se complete
            } catch (error) {
                console.error('Error al enviar la petición:', error);
            }

            const confirmationMessage = '¿Estás seguro de que quieres abandonar esta página?';
            event.returnValue = confirmationMessage;
            return confirmationMessage;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const sendDatos = async () => {
        const url = `${process.env.REACT_APP_API_URL}api=cancion&id=infocanciones`;

        try {
            const response = await axios.post(url, cookies.get('jsdatos'));
            cookies.remove('jsdatos', { path: window.location.pathname });
            return response.data;
        } catch (error) {
            toast.error('Ocurrió un error!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            console.log(error);
            throw error; // Lanzar el error para que se maneje en el controlador de evento
        }
    };

    const actualizaTiempo = () => {
        var jsDatos = cookies.get('jsdatos')
        jsDatos.minutos += 1;
        const path = window.location.pathname;
        cookies.set('jsdatos', jsDatos, { path: path });
    }

    const actualizaVeces = (id) => {
        var jsDatos = cookies.get('jsdatos')
        jsDatos.canciones.forEach(element => {
            if (element.id_cancion === id) {
                element.veces++;
            }
        });
        const path = window.location.pathname;
        cookies.set('jsdatos', jsDatos, { path: path });
    }

    const problema = async (error) => {
        toast.warning(error, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        await sleep(3000);
        window.history.back()
    }

    const token = sessionStorage.getItem("token")
    if (token !== null) {
        verificarRol(token)
        var jsDatos = cookies.get('jsdatos');
        const id = parseInt(window.location.pathname.split('/')[2]);
        const Tipo = jwt_decode(token);
        datosAlbum = { id_usuario: Tipo.id, id_album: id };
        jsDatos.id_usuario = Tipo.id
        const path = window.location.pathname;
        cookies.set('jsdatos', jsDatos, { path: path });
    } else {
        window.location.href = "/login"
        return;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        fetchData()
            .then(response => {
                console.log(response)
                if ('error' in response[0]) {
                    problema(response[0].error)
                } else {
                    initLog(response)
                    if (prim) {
                        var jsDatos = cookies.get('jsdatos')
                        response.forEach(element => {
                            console.log(response)
                            var rola = {
                                id_cancion: element.id,
                                veces: 0
                            }
                            jsDatos.canciones.push(rola);
                        });
                        const path = window.location.pathname;
                        cookies.set('jsdatos', jsDatos, { path: path });
                        setprim(false)
                    }
                }
            })
            .catch(error => {
                toast.error('Ocurrio un error!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                console.log(error)
            })

    }, [])
    if (logItems == []) {
        return (<div><h1>Hola</h1></div>)
    }
    return (
        <div>
            <BarraUsuario></BarraUsuario>
            <ReproductorMusica listaCanciones={logItems} actTiempo={actualizaTiempo} actVeces={actualizaVeces} datosAlbum={datosAlbum} />
        </div>
    )
}