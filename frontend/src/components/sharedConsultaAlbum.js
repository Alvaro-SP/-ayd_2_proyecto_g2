import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { BarraUsuario } from "./BarraUsuario";
import PlayerFooter from "./PlayerFooter";
import Player from './Player';
import jwt_decode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faPlay } from '@fortawesome/free-solid-svg-icons';
import backgroundImage from "../images/back.jpg";
import "../styles/ConsultaAlbum.css";

const URL_API = `${process.env.REACT_APP_API_URL}api=album&id=listar`;
const URL_API1 = `${process.env.REACT_APP_API_URL}api=cancion&id=canciones`;

export default class SharedConsultAlbum extends Component {

    constructor(props) {
        super(props);

        this.handleReproductor = this.handleReproductor.bind(this);

        this.state = {
            id: '',
            idAlbum: '',
            idCancion: '',
            datos: [],
            canciones: []
        }
    }

    async componentDidMount() {
        this.id = localStorage.getItem('asl');
        await this.getAlbums();
    }

    handleReproductorAlb = () => {
        const enlace = '/sharedAlbum/' + this.id + '/' + localStorage.getItem("albumVisualizado") ;
        window.location.href = enlace;
    }

    handleReproductor = (id) => {
        const enlace = '/shared    alert()Song/' + this.id + '/' + localStorage.getItem("albumVisualizado") + '/' + id;
        window.location.href = enlace;
        
    }
 
    handleSharedSong = (id) => {
        const host = window.location.host;
        const textoACopiar = host + '/sharedSong/' + this.id + '/' + localStorage.getItem("albumVisualizado") + '/' + id;

        navigator.clipboard.writeText(textoACopiar)
            .then(() => {
                toast.success('Enlace de la canción copiado al portapapeles', { autoClose: 2000 });
            })
            .catch((error) => {
                console.error('Error al copiar al portapapeles: ', error);
                toast.error('Error al copiar al portapapeles: ', error, { autoClose: 2000 });
            });
    }

    getAlbums = async () => {
        axios.post(`${URL_API}`, { idUser: this.id })
            .then(res => {
                console.log(this.id)
                for (let i = 0; i < res.data.albums.length; i++) {
                    if (res.data.albums[i].idALBUM == localStorage.getItem("albumVisualizado")) {
                        this.setState({ datos: res.data.albums[i] })
                    }
                }
                this.getCanciones();
            })
            .catch(err => {
                console.log(err);
                toast.error('Error al cargar los datos del album...', {
                    position: toast.POSITION.BOTTOM_CENTER,
                    autoClose: 2000
                });
                this.datos = [];
            });
    }

    getCanciones = async () => {
        axios.get(`${URL_API1}&id_user=${this.id}&id_album=${localStorage.getItem("albumVisualizado")}`)
            .then(res => {
                console.log(res.data)
                this.setState({ datos: this.state.datos, canciones: res.data });
                this.idCancion = res.data[0].idCANCION;
            })
            .catch(err => {
                console.log(err);
                toast.error('Error al cargar las canciones del album...', {
                    position: toast.POSITION.BOTTOM_CENTER,
                    autoClose: 2000
                });
                this.canciones = [];
            });
    }

    render() {
        return (
            <div className="cgeneral" style={{
                backgroundImage: `url(${backgroundImage})`
            }}>
                <BarraUsuario />
                
                <br></br>
                <div className="container text-center" >
                <h2>Informacion y Canciones en Album</h2>
                    <div className="row" >
                        <div className="col">
                            <div>
                                <ul className="album-details">
                                    <li>
                                        <img src={this.state.datos.imglink} alt="Portada Album" className="album-image"></img>
                                    </li>
                                    <li><h1 className="album-title">Título: {this.state.datos.nombre}</h1><button type="button"className="btn play-button"
                                                                    onClick={() => {this.handleReproductorAlb()}}><FontAwesomeIcon icon={faPlay} /></button></li>
                                    <li><h4 className="album-date">Fecha: {new Date(this.state.datos.fecha_creacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</h4></li>
                                    <li><h4 className="album-song-count">Cantidad de Canciones: {this.state.canciones.length}</h4></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col">
                            <div className="text-center song-list-container">
                                <table className="table-dark">
                                    <thead>
                                        <tr>
                                            <th className="text-center" scope="col">Nombre</th>
                                            <th className="text-center" scope="col">No. Rep</th>
                                            <th className="text-center" scope="col">Fecha</th>
                                            <th className="text-center" scope="col">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.canciones.map((canciones, i) => {
                                                const fecha = new Date(canciones.fecha);
                                                const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
                                                
                                                return (
                                                    <tr key={i}>
                                                        <td className="text-center song-name">{canciones.nombre}</td>
                                                        <td className="text-center song-rep">{canciones.no_reproducciones}</td>
                                                        <td className="text-center song-date">{fechaFormateada}</td>
                                                        <td className="text-center song-actions">
                                                            <div className="btn-group">
                                                                <button
                                                                    type="button"
                                                                    className="btn play-button"
                                                                    onClick={() => {
                                                                        this.handleReproductor(canciones.id);
                                                                    }}
                                                                >
                                                                    <FontAwesomeIcon icon={faPlay} />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn share-button"
                                                                    onClick={() => {
                                                                        this.handleSharedSong(canciones.id);
                                                                    }}
                                                                >
                                                                    <FontAwesomeIcon icon={faLink} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
