import { Container, Grid } from "@mui/material";
import React from "react";
import { BarraAdmin } from "../BarraAdmin";
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FilaUsuarios } from "./FilaUsuarios";

export class Usuarios extends React.Component {
    state = {
        usuarios: []
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
        this.cargarUsuarios()
    }

    cargarUsuarios = () => {
        axios.get(`${process.env.REACT_APP_API_URL}api=admin&id=usuarios`)
            .then(response => {
                if (response.data.Res) {
                    this.setState({
                        usuarios: response.data.Usuarios
                    }
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
                        <h1 style={{color:'black'}}>Usuarios del sistemas</h1>
                    </div>
                    <Grid display="flex" justifyContent="center" alignItems="center" >
                        <div style={{ width: '75%', maxHeight: "350px", overflow: "auto" }}>
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col" class="text-center">#</th>
                                        <th scope="col" class="text-center">Nombre</th>
                                        <th scope="col" class="text-center">Usuario</th>
                                        <th scope="col" class="text-center">Fecha Nacimiento</th>
                                        <th scope="col" class="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.usuarios.map((usuario, index) => (
                                            <FilaUsuarios usuario={usuario} index={index} recargar={this.cargarUsuarios} />
                                        ))
                                    }

                                </tbody>
                            </table>

                            <br></br>
                        </div>

                    </Grid>
                </div>
                <ToastContainer />
            </>
        )
    }

}