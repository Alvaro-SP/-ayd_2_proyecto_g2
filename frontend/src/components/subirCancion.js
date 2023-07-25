import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { BarraUsuario } from "./BarraUsuario";
import jwt_decode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { Container, Grid } from "@mui/material";
import backgroundImage from "../images/back.jpg";

function getFileExtension2(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
export default class SubirCancion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ext: '',
            base64: '',
            name: ''
        }
    }



    handleName = (e) => {
        this.setState({
            ext: this.state.ext,
            base64: this.state.base64,
            name: e.target.value
        })
    }

    handleFileRead = async (e) => {
        const file = e.target.files[0];
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            this.setState({
                ext: getFileExtension2(e.target.value),
                base64: reader.result,
                name: this.state.name
            })
        }
    }

    static sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    handleButton = async () => {
        const Tipo = jwt_decode(sessionStorage.getItem("token"));
        let aux = this.state.base64.split(",", 2)
        let cuerpo = {
            ext: this.state.ext,
            name: this.state.name,
            base64: aux[1],
            id: Tipo.id

        }
        axios.post(`${process.env.REACT_APP_API_URL}api=cancion&id=subircancion`, cuerpo)
            .then(async response => {

                if (response.data.Res) {
                    toast.success("Cancion subida con exito", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    })
                    await sleep(3000)
                    window.location.href = ""

                } else {
                    toast.warning("Fallo al subir la cancion", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                    });
                }
            })
            .catch(err => {
                console.log(err)
                toast.warning("Fallo al subir la cancion - ERROR", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            })

    }





    render() {
        return (
            <>
                <div className="cgeneral" style={{
                    backgroundImage: `url(${backgroundImage})`
                }}>
                    <BarraUsuario />
                    <Grid display="flex" justifyContent="center" alignItems="center" style={{ padding: '5%' }}>
                        <div style={{ background: 'rgba(8, 83, 148, 0.8)', width: '45%', height: '60%' }}>
                            <fieldset style={{ borderColor: "white", borderStyle: 'solid', borderWidth: '2px' }}>
                                <legend className="text-center" style={{ color: "white" }}>Subir Cancion</legend><br />
                                <form>
                                    <div style={{ margin: '5%' }}>
                                        <div class="mb-3">
                                            <label for="nombre" class="form-label" style={{ color: "white" }}>Nombre Cancion</label>
                                            <input type="text" className="form-control" id="usuario" required style={{ background: 'white', color: 'black' }} onChange={this.handleName} />
                                        </div>
                                        <div class="mb-3">
                                            <label for="song" class="form-label" style={{ color: "white" }}>Cancion</label>
                                            <input className="form-control text-2xl" type="file" accept="audio/*" name="song" id="song" onChange={this.handleFileRead} placeholder="song" />
                                        </div>
                                        <br></br>
                                        <div class="mb-3">
                                            <input type="button" className="form-control" id="pass2" style={{ background: 'gold', color: '#223263' }} value="Subir Cancion" onClick={this.handleButton} />
                                        </div>
                                        <br></br>


                                    </div>
                                </form>
                            </fieldset>

                        </div>
                    </Grid>

                </div>
                <ToastContainer />
            </>
        )
    }
}