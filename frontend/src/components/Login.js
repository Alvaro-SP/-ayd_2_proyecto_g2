import { Container, Grid, Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import React from "react";
import { BarraInicio } from "./BarraInicio";
import axios from 'axios';
import { AES } from 'crypto-js';
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import backgroundImage from '../images/login.jpg'
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Login.css'
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export class Login extends React.Component {
    usuario = ""
    password = ""
    token = ""
    state = {
        showModal: false
    }

    componentDidMount() {
        const token = sessionStorage.getItem("token")
        if (token !== null) { this.verificarRol(token) }
    }

    static sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async verificarRol(token) {
        const Tipo = jwt_decode(token);
        const expiracion = Tipo.exp;
        if (expiracion < Date.now() / 1000) {
            sessionStorage.clear();
            toast.warning('Su sesión ha expirado!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            await sleep(3000);
            window.location.href = "/login";
        }
        if (Tipo.tipo === 0) {
            toast.success("Bienvenido Administrador", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            await sleep(3000);
            window.location.href = "/admin";
        } else {
            toast.success("Bienvenido, " + this.usuario, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            await sleep(3000);
            window.location.href = "/usuario";
        }
    }

    setUsuario = (e) => {
        this.usuario = e.target.value
    }

    setPassword = (e) => {
        this.password = e.target.value
    }

    setToken = (e) => {
        this.token = e.target.value
    }

    login = (e) => {
        if (this.usuario === "" || this.password === "") {
            toast.warning('Complete todos los campos!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            return
        }

        //encriptado password
        const encryptedPassword = AES.encrypt(this.password, process.env.REACT_APP_CRYPTO_KEY).toString()

        axios.post(`${process.env.REACT_APP_API_URL}api=loginflow&id=login`,
            {
                usuario: this.usuario,
                password: encryptedPassword
            }
        )
            .then(response => {
                console.log("response")
                console.log(response)

                if (response.data.Res) {
                    if (response.data.fa2) {
                        this.token = ""
                        this.setState({ showModal: true })
                        return
                    } else {
                        sessionStorage.setItem("token", response.data.Token)
                        this.verificarRol(response.data.Token)
                    }

                } else {
                    toast.warning(response.data.Mensaje, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                }
            })
            .catch(error => {
                toast.error('Ocurrió un error!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            })
    }

    login2fa = (e) => {
        if (this.usuario === "" || this.token === "") {
            toast.warning('Complete todos los campos!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            return
        }

        axios.post(`${process.env.REACT_APP_API_URL}api=loginflow&id=login2fa`,
            {
                usuario: this.usuario,
                token: this.token
            }
        )
            .then(async response => {
                console.log("response")
                console.log(response)
                if (response.data.Res) {
                    sessionStorage.setItem("token", response.data.Token)
                    this.verificarRol(response.data.Token)
                } else {

                    toast.warning(response.data.Mensaje, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                    await sleep(3000);
                    window.location.href = ""
                }
            })
            .catch(async error => {

                toast.error('Ocurrió un error!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                await sleep(3000);
                window.location.href = ""
            })
    }


    handleCloseModal = () => {
        this.setState({ showModal: false })
        window.location.href = ""
    }

    render() {
        const { showModal } = this.state
        return (
            <div className="cgeneral" style={{
                backgroundImage: `url(${backgroundImage})`
            }}>
                <BarraInicio></BarraInicio>
                <Grid display="flex" justifyContent="center" alignItems="center" style={{ padding: '5%' }}>
                    <Container style={{ background: 'rgba(8, 83, 148, 0.8)', width: '45%', height: '60%' }}>
                        <br />
                        <fieldset style={{ borderColor: "white", borderStyle: 'solid', borderWidth: '2px' }}>
                            <legend className="text-center" style={{ color: "white" }}>Login</legend><br />
                            <form onSubmit={this.login}>
                                <div style={{ margin: '5%' }}>
                                    <div className="mb-2 row">
                                        <div className="col-sm-6">
                                            <label htmlFor="usuario" className="col-sm-4 col-form-label" style={{ color: "white" }}>Usuario</label>
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="text" className="form-control" id="usuario" onChange={this.setUsuario} required style={{ background: 'white', color: 'black' }} />
                                        </div>
                                    </div>
                                    <div className="mb-2 row">
                                        <div className="col-sm-6">
                                            <label htmlFor="pass" className="col-sm-4 col-form-label" style={{ color: "white" }}>Contraseña</label>
                                        </div>
                                        <div className="col-sm-6">
                                            <input type="password" className="form-control" id="pass" onChange={this.setPassword} required style={{ background: 'white', color: 'black' }} />
                                        </div>
                                    </div>
                                    <div className="mb-2 row">
                                        <div className="col-12">
                                            <input type="button" className="form-control" id="pass2" style={{ background: 'gold', color: '#223263' }} value="Login" onClick={this.login} />
                                            <Dialog open={showModal} onClose={this.handleCloseModal}>
                                                <DialogTitle style={{ color: 'black' }}>Two-Factor Authentication</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText>Inserte su token</DialogContentText>
                                                    <TextField label="Your Token" onChange={this.setToken} />
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={this.login2fa}>Verificar Token</Button>
                                                    <Button onClick={this.login}>Reenviar Token</Button>
                                                    <Button onClick={this.handleCloseModal}>Cancel</Button>
                                                </DialogActions>
                                            </Dialog>

                                        </div>
                                    </div>
                                    <br />
                                    <div className="mb-2 row text-center">
                                        <div className="col-12">
                                            <p style={{ color: "white" }}>No tienes cuenta? <a href="registro" style={{ color: "white" }}>Registrate</a></p>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </fieldset>
                        <br />
                    </Container>
                    <ToastContainer />
                </Grid>
            </div>
        )
    }
}
