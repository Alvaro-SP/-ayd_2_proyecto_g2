import { Container, Grid } from "@mui/material";
import React, { Component, useState, useEffect } from "react";
import { BarraUsuario } from './BarraUsuario'
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';
import ReproductorMusicaS from './PlayerS';
import axios from 'axios';

export default function SharedCancion() {
    const [logItems, initLog] = useState([])
    var datosAlbum = { id_usuario: 0, id_album: 0, id_cancion: 0 };

    const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };


    const fetchData = async () => {
        const url = `${process.env.REACT_APP_API_URL}api=cancion&id=cancion&id_user=${datosAlbum.id_usuario}&id_album=${datosAlbum.id_album}&id_cancion=${datosAlbum.id_cancion}`
        const response = await axios.get(url)
        return response.data
    }

    const problema = async (error) => {
        toast.warning(error, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
        });
        await sleep(3000);
        window.history.back()
    }

    const id_usr = parseInt(window.location.pathname.split('/')[2]);
    const id = parseInt(window.location.pathname.split('/')[3]);
    const id_song = parseInt(window.location.pathname.split('/')[4]);
    datosAlbum = { id_usuario: id_usr, id_album: id, id_cancion: id_song };


    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        fetchData()
            .then(response => {
                console.log(response)
                if ('error' in response[0]) {
                    problema(response[0].error)
                } else {
                    initLog(response)
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
            <ReproductorMusicaS listaCanciones={logItems} datosAlbum={datosAlbum} />
        </div>
    )
}