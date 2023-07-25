import { Container, Grid } from "@mui/material";
import React from "react";
import { BarraInicio } from "./BarraInicio";
import axios from 'axios';
import { AES } from 'crypto-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
export class Registro extends React.Component {

    usuario = ""
    nombre = ""
    correo = ""
    fecha = ""
    telefono = ""
    password = ""
    confPass = ""

    setUsuario = (e) => {
        this.usuario = e.target.value
    }

    setNombre = (e) => {
        this.nombre = e.target.value
    }

    setCorreo = (e) => {
        this.correo = e.target.value
    }

    setFecha = (e) => {
        this.fecha = e.target.value
    }

    setPassword = (e) => {
        this.password = e.target.value
    }

    setConfPas = (e) => {
        this.confPass = e.target.value
    }

    setTelefono = (e) => {
        this.telefono = e.target.value
    }

    registro = (e) => {
        if (this.nombre == "" || this.usuario == "" || this.correo == "" || this.fecha == "" || this.telefono == "" || this.confPass == "" || this.telefono.length != 8) {
            toast.warning('Complete todos los campos!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
            return
        }
        if (this.password != this.confPass) {
            toast.error('Las contraseñas no coinciden', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
            return
        }

        //encriptado password
        const encryptedPassword = AES.encrypt(this.password, process.env.REACT_APP_CRYPTO_KEY).toString()

        axios.post(`${process.env.REACT_APP_API_URL}api=loginflow&id=registro`,
            {
                nombre: this.nombre,
                usuario: this.usuario,
                correo: this.correo,
                fecha: this.fecha,
                telefono: this.telefono,
                password: encryptedPassword
            }
        )
            .then(async response => {
                console.log("response")
                console.log(response)
                //alert(response.data.Mensaje)
                if (response.data.Res) {
                    toast.success("Se ha registrado correctamente, " + this.nombre, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                    await sleep(3000);
                    window.location.href = '/login'
                } else {
                    toast.warning(response.data.Mensaje, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });
                }

            })
            .catch(error => {
                toast.error('Ocurrio un error', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
            })
    }
    render() {
        return (
            // faf056 F8EB25
            // 085394
            <div>
                <BarraInicio></BarraInicio>
                <Grid display="flex" justifyContent="center" alignItems="center" style={{ padding: '2%' }}>
                    <Container style={{ background: '#085394', width: '45%', height: '60%' }}>
                        <br>
                        </br>
                        <fieldset style={{ borderColor: "white", borderStyle: 'solid', borderWidth: '2px' }}>
                            <legend className="text-center" style={{ color: "white" }}>Registro</legend><br></br>
                            <form onSubmit={this.registro}>
                                <div style={{ margin: '5%' }}>
                                    <div class="mb-2 row">
                                        <div class="col-sm-6">
                                            <label for="usuario" class="col-sm-4 col-form-label" style={{ color: "white" }}>Usuario</label>
                                        </div>
                                        <div class="col-sm-6">
                                            <input type="text" class="form-control" id="usuario" onChange={this.setUsuario} required style={{ background: 'white', color: 'black' }} />
                                        </div>
                                    </div>
                                    <div class="mb-2 row">
                                        <div class="col-sm-6">
                                            <label for="nombre" class="col-sm-4 col-form-label" style={{ color: "white" }}>Nombre</label>
                                        </div>
                                        <div class="col-sm-6">
                                            <input type="text" class="form-control" id="nombre" onChange={this.setNombre} required style={{ background: 'white', color: 'black' }} />
                                        </div>
                                    </div>
                                    <div class="mb-2 row">
                                        <div class="col-sm-6">
                                            <label for="correo" class="col-sm-4 col-form-label" style={{ color: "white", marginLeft: '0' }}>Correo Electronico</label>
                                        </div>
                                        <div class="col-sm-6">
                                            <input type="email" class="form-control" id="correo" onChange={this.setCorreo} required style={{ background: 'white', color: 'black' }} />
                                        </div>
                                    </div>
                                    <div class="mb-2 row">
                                        <div class="col-sm-6">
                                            <label for="fecha" class="col-sm-4 col-form-label" style={{ color: "white" }}>Fecha Nacimiento</label>
                                        </div>
                                        <div class="col-sm-6">
                                            <input type="date" class="form-control" id="fecha" onChange={this.setFecha} required style={{ background: 'white', color: 'black' }} />
                                        </div>
                                    </div>
                                    <div class="mb-2 row">
                                        <div class="col-sm-6">
                                            <label for="telefono" class="col-sm-4 col-form-label" style={{ color: "white" }}>Telefono</label>
                                        </div>
                                        <div class="col-sm-6">
                                            <input type="number" class="form-control" id="telefono" pattern="\d{8}" onChange={this.setTelefono} required style={{ background: 'white', color: 'black' }} />
                                        </div>
                                    </div>
                                    <div class="mb-2 row">
                                        <div class="col-sm-6">
                                            <label for="pass" class="col-sm-4 col-form-label" style={{ color: "white" }}>Contraseña</label>
                                        </div>
                                        <div class="col-sm-6">
                                            <input type="password" class="form-control" id="pass" onChange={this.setPassword} required style={{ background: 'white', color: 'black' }} />
                                        </div>
                                    </div>
                                    <div class="mb-2 row">
                                        <div class="col-sm-6">
                                            <label for="pass2" class="col-sm-4 col-form-label" style={{ color: "white" }}>Confirmar Contraseña</label>
                                        </div>
                                        <div class="col-sm-6">
                                            <input type="password" class="form-control" id="pass2" onChange={this.setConfPas} required style={{ background: 'white', color: 'black' }} />
                                        </div>
                                    </div>
                                    <div class="mb-2 row">
                                        <div class="col-12">
                                            <input type="button" class="form-control" id="pass2" style={{ background: 'gold', color: '#223263' }} value="Registrarse" onClick={this.registro} />
                                        </div>
                                    </div>
                                    <br></br>
                                    <div class="mb-2 row text-center">
                                        <div class="col-12">
                                            <p style={{ color: "white" }}>Ya tienes cuenta? <a href="login" style={{ color: "white" }}>Login</a></p>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </fieldset>

                        <br></br>
                    </Container>

                </Grid>
                <ToastContainer />
            </div>
        )
    }

}