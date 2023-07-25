import { useEffect, useState } from "react";
import { url } from "../../shared/url";
import { auth } from "../../shared/auth";
import axios from "axios";
import "../../styles/usuario/perfil_user.css";
import { AES } from 'crypto-js';
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Typography } from '@mui/material';
// import "materialize-css";
// import "materialize-css/dist/css/materialize.min.css";
import { Grid, TextField, Button } from '@mui/material';
import { Person, Markunread, Smartphone, Map, Badge } from '@mui/icons-material';
import { ChangeCircle } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { VisibilityOff } from '@mui/icons-material';
import CryptoJS from 'crypto-js';
export function VerPerfil() {

    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [date_born, setDate_born] = useState("");
    const [password, setPassword] = useState("");
    const [followers, setFollowers] = useState("");
    const [time_rep, setTime_rep] = useState("");
    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");

    useEffect(() => {
        getPerfil()
    }, []);

    const getPerfil = async () => {
        const data = {
            token: sessionStorage.getItem("token")
        }

        try {
            console.log(data)
            const result = (await axios.post(`${process.env.REACT_APP_API_URL}api=usuario&id=profile`, data, auth)).data
            console.log("RESULT", result)

            if (result) {
                setName(result[0].nombre);
                setMail(result[0].correo);
                const fecha = new Date(result[0].nacimiento);
                const opcionesFecha = { day: "numeric", month: "long", year: "numeric" };
                const formatoEntendible = fecha.toLocaleDateString("es-ES", opcionesFecha);
                setDate_born(formatoEntendible)
                setPassword(result[0].contraseña)
                setFollowers(result[0].totalFollowers)
                setTime_rep(result[0].t_reproduccion)
                const segundos = result[0].t_reproduccion;
                const minutos = Math.floor(segundos / 60); // Obtener los minutos
                const horas = Math.floor(minutos / 60); // Obtener las horas
                // se calculan los minutos restantes después de las horas
                const minutosRestantes = minutos % 60;

                // se calculan los segundos restantes después de los minutos
                const segundosRestantes = segundos % 60;
                setHours(horas)
                setMinutes(minutosRestantes)
                toast.success(result.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            } else {
                toast.error(result.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }
        } catch (error) {
            console.log(error)
            toast.error("Su sesion ha expirado!, codigo: "+error.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }


    return (
        <>
            <section>
                <div className="containerProfile">
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h2" color="black" align="center">
                                Bienvenido Usuario
                            </Typography>
                            <hr />
                            <div className="row center-content borderRating">
                                <div className="col s1 center-content">
                                    <FavoriteIcon sx={{ fontSize: 50, color: "red", marginLeft: "30%" }} />
                                    <i className="material-icons medium yellow-text text-darken-3">{followers} seguidores</i>
                                </div>
                                <div className="col s5 center-align">
                                    <WatchLaterIcon sx={{ fontSize: 50, color: "blue" }} />
                                    <i className="material-icons medium yellow-text text-darken-3">{hours} horas {minutes} minutos reproducidos</i>
                                </div>
                            </div>
                            <br />
                        </Grid>
                        <Grid item xs={5} sm={8} md={6} lg={8} xl={3} sx={{ margin: "0 auto" }}>
                            <form>
                                <Grid container spacing={4} >
                                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                                        {/* <h3 className="center-align">Nombre:  </h3> */}
                                        <TextField
                                            fullWidth
                                            disabled
                                            label="NOMBRE"
                                            InputProps={{
                                                startAdornment: <Person />,
                                                className: "black-text"
                                            }}
                                            value={name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                                        <TextField
                                            fullWidth
                                            disabled
                                            label="CORREO"
                                            InputProps={{
                                                startAdornment: <Markunread />,
                                                className: "black-text"
                                            }}
                                            value={mail}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                                        <TextField
                                            fullWidth
                                            disabled
                                            label="FECHA DE NACIMIENTO"
                                            InputProps={{
                                                startAdornment: <Map />,
                                                className: "black-text"
                                            }}
                                            value={date_born}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                                        <TextField
                                            fullWidth
                                            disabled
                                            label="CONTRASENA"
                                            type="password"
                                            InputProps={{
                                                startAdornment: <VisibilityOff />,
                                                className: "black-text"
                                            }}
                                            value={password}
                                        />
                                    </Grid>
                                    {/* <Grid item md={4} lg={5} xs={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            startIcon={<ChangeCircle />}
                                            fullWidth
                                            href="#changeUbication"
                                            OnClick={changeZoneSol}
                                        >
                                            GUARDAR CAMBIOS
                                        </Button>
                                    </Grid> */}
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                    <br />
                    <br />
                </div>
            </section>
        </>
    );
}