import React, { useState, useRef, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"; // icons for play and pause
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi"; // icons for next and previous track
import { IconContext } from "react-icons"; // for customazing the icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/Player.css"
import imagenRep from "../images/rep.gif"

const ReproductorMusicaS = ({ listaCanciones, datosAlbum }) => {
    const [cancionActual, setCancionActual] = useState(0);
    const [reproduciendo, setReproduciendo] = useState(false);
    const [duracion, setDuracion] = useState(0);
    const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
    const [rep, setRep] = useState(false);
    const audioRef = useRef(null);
    const rangeInputRef = useRef(null);

    const reproducirCancion = () => {
        setReproduciendo(true);
        audioRef.current.play();
    };

    const pausarCancion = () => {
        setReproduciendo(false);
        audioRef.current.pause();
    };

    const siguienteCancion = () => {
        if(reproduciendo){
            pausarCancion()
        }
        setRep(false)
        if (cancionActual === listaCanciones.length - 1) {
            setCancionActual(0);
        } else {
            setCancionActual(cancionActual + 1);
        }

    };

    const anteriorCancion = () => {
        if(reproduciendo){
            pausarCancion()
        }
        setRep(false)
        if (cancionActual === 0) {
            setCancionActual(listaCanciones.length - 1);
        } else {
            setCancionActual(cancionActual - 1);
        }
    };

    const copiarTexto = () => {
        const host = window.location.host;
        const textoACopiar = host + '/sharedSong/' + datosAlbum.id_usuario + '/' + datosAlbum.id_album + '/' + listaCanciones[cancionActual]?.id;

        navigator.clipboard.writeText(textoACopiar)
            .then(() => {
                toast.success('Enlace de la canción copiado al portapapeles', { autoClose: 2000 });
            })
            .catch((error) => {
                console.error('Error al copiar al portapapeles: ', error);
                toast.error('Error al copiar al portapapeles: ', error, { autoClose: 2000 });
            });
    }

    const cambiarTiempoCancion = () => {
        const tiempoSeleccionado = parseFloat(rangeInputRef.current.value);
        audioRef.current.currentTime = tiempoSeleccionado;
        setTiempoTranscurrido(tiempoSeleccionado);
    };

    const obtenerTiempo = (time) =>{
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        var cad = ""
        if (min<10){
            cad += "0" + min + ":"
        }else{
            cad += min + ":"
        }
        if (sec<10){
            cad += "0" + sec
        }else{
            cad += sec
        }
        return cad
    }

    useEffect(() => {
        const actualizarDuracion = () => {
          setDuracion(audioRef.current.duration);
        };
    
        audioRef.current.addEventListener('loadedmetadata', actualizarDuracion);
    
        return () => {
          audioRef.current.removeEventListener('loadedmetadata', actualizarDuracion);
        };
    }, [cancionActual]);

    useEffect(() => {
        let intervaloTiempo;
    
        if (reproduciendo) {
          intervaloTiempo = setInterval(() => {
            setTiempoTranscurrido(audioRef.current.currentTime);
          }, 1000);
        } else {
          clearInterval(intervaloTiempo);
        }
    
        return () => clearInterval(intervaloTiempo);
    }, [reproduciendo]);
    

    return (
        <div className="compg">
            <div className="component">
                <div className="cont-components">
                    <h2>Reproduciendo ahora</h2>
                    <audio ref={audioRef} src={listaCanciones[cancionActual]?.link} />
                    <img className="musicCover" src={imagenRep}/>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '50%' }}>
                            <br/>
                            <h3 className="title">{listaCanciones[cancionActual]?.nombre}</h3>
                            
                        </div>
                        &nbsp;&nbsp;
                        <div style={{ width: '1%' }}>
                            <div class="icon enlace">
                                <div class="tooltip">Copiar</div>
                                <span onClick={copiarTexto}><FontAwesomeIcon icon={faLink} /></span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="time">
                        <p>
                            {obtenerTiempo(tiempoTranscurrido.toFixed(2))}
                        </p>
                        <p>
                            {obtenerTiempo(duracion.toFixed(2))}
                        </p>
                        </div>
                        <input
                            className="timeline"
                            type="range"
                            min="0"
                            max={duracion.toFixed(2)}
                            step="0.01"
                            value={tiempoTranscurrido.toFixed(2)}
                            onChange={cambiarTiempoCancion}
                            ref={rangeInputRef}
                        />
                    </div>
                    <div className="row">
                        <button className="playButton col" onClick={anteriorCancion}>
                        <IconContext.Provider value={{ size: "4em", color: "#F8EB25" }}>
                            <BiSkipPrevious />
                        </IconContext.Provider>
                        </button>
                        {!reproduciendo ? (
                        <button className="playButton col" onClick={reproducirCancion}>
                            <IconContext.Provider value={{ size: "4em", color: "#F8EB25" }}>
                            <AiFillPlayCircle />
                            </IconContext.Provider>
                        </button>
                        ) : (
                        <button className="playButton col" onClick={pausarCancion}>
                            <IconContext.Provider value={{ size: "4em", color: "#F8EB25" }}>
                            <AiFillPauseCircle />
                            </IconContext.Provider>
                        </button>
                        )}
                        <button className="playButton col" onClick={siguienteCancion}>
                        <IconContext.Provider value={{ size: "5em", color: "#F8EB25" }}>
                            <BiSkipNext />
                        </IconContext.Provider>
                        </button>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default ReproductorMusicaS;

