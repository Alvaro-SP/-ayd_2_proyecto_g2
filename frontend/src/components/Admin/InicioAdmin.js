import { Container, Grid } from "@mui/material";
import React from "react";
import { BarraAdmin } from "../BarraAdmin";
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FilaSolicitudes } from "./FilaSolicitudes";

export class InicioAdmin extends React.Component {
    state = {
        solicitudes: []
    }

    componentDidMount() {
        const token = sessionStorage.getItem("token")
        if (token !== null) { this.verificarRol(token) }
        else {
            window.location.href = "/login"
            return;
        }
    }

    verificarRol = (token) => {
        const Tipo = jwt_decode(token);
        const expiracion = Tipo.exp
        if (expiracion < Date.now() / 1000) {
            sessionStorage.clear()
            toast.warning('Tu sesion ha expirado!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            setTimeout(() => {
                window.location.href = "/login"
            }, 3000)
        }
        if (Tipo.tipo !== 0) {
            window.location.href = "/accessDenied"
        }
        this.cargarSolicitudes()

    }

    cargarSolicitudes = () => {
        axios.get(`${process.env.REACT_APP_API_URL}api=admin&id=solicitudes`)
            .then(response => {
                if (response.data.Res) {
                    this.setState(
                        { solicitudes: response.data.Solicitudes }
                    )
                }
                else {
                    toast.error("Ocurrio un error", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                }
            })
            .catch(error => {
                console.log(error)
                toast.warning("Ocurrio un error", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            })
    }

    render() {
        return (
            // faf056 F8EB25
            // 085394
            <>
                <div>
                    <BarraAdmin></BarraAdmin>
                    <div class="text-center" style={{ padding: '2%' }}>
                        <h1 style={{color:'black'}}>Solicitudes de usuarios</h1>
                    </div>
                    <Grid display="flex" justifyContent="center" alignItems="center" >
                        {/* <Container style={{   height: '60%' }}> */}
                        <div style={{ width: '75%', maxHeight: "350px", overflow: "auto" }}>
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col" class="text-center">#</th>
                                        <th scope="col" class="text-center">Nombre</th>
                                        <th scope="col" class="text-center">Usuario</th>
                                        <th scope="col" class="text-center">Fecha Nacimiento</th>
                                        <th scope="col" colSpan={2} class="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.solicitudes.map((solicitud, index) => (
                                            <FilaSolicitudes solicitud={solicitud} index={index} refrescar={this.cargarSolicitudes} />
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Grid>
                </div>
                <ToastContainer />
            </>
        )
    }

}