import { useEffect, useState } from "react";
import { url } from "../../shared/url";
import { auth } from "../../shared/auth";
import axios from "axios";
import "../../styles/usuario/perfil_user.css";
import { BarraUsuario } from "../BarraUsuario";
import { SidebarUser } from "./SidebarUser";
import { AES } from 'crypto-js';
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Typography } from '@mui/material';
// import "materialize-css";
// import "materialize-css/dist/css/materialize.min.css";
import { FormControl, Grid, InputLabel, MenuItem, Select, Button,Checkbox} from '@mui/material';
import TextField from '@mui/material/TextField';
import { Person, Markunread, Smartphone, Map, Badge } from '@mui/icons-material';
import { ChangeCircle } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { VisibilityOff } from '@mui/icons-material';
export function EditarPerfil() {

    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [date_born, setDate_born] = useState("");
    const [password, setPassword] = useState("");
    const [followers, setFollowers] = useState("");
    const [time_rep, setTime_rep] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [dayprev, setDayprev] = useState("");
    const [monthprev, setMonthprev] = useState("");
    const [yearprev, setYearprev] = useState("");
    const [oldPasswordError, setOldPasswordError] = useState(false);
    const [Activarguardado, setActivarguardado] = useState(true);
    const [Activarguardado2, setActivarguardado2] = useState(true);
    const [oldPasswordHelperText, setOldPasswordHelperText] = useState('');
    const [activarmail, setActivarmail] = useState(false);
    const [textactivermail, setTextactivermail] = useState(true);
    const [fecharespaldo, setFecharespaldo] = useState("");
    const [tipoAuth, setTipoAuth] = useState("");
    const [auth, setAuth] = useState("");
    useEffect(() => {
        getPerfil()
    }, []);

    const getPerfil = async () => {
        const data = {
            token: sessionStorage.getItem("token")
        }

        try {
            console.log(data)
            const result = (await axios.post(`${process.env.REACT_APP_API_URL}api=usuario&id=profile`, data)).data
            console.log("RESULT", result)

            if (result) {
                setName(result[0].nombre);
                setMail(result[0].correo);
                setFecharespaldo(result[0].nacimiento);
                const fecha = new Date(result[0].nacimiento);
                const opcionesFecha = { day: "numeric", month: "long", year: "numeric" };
                const formatoEntendible = fecha.toLocaleDateString("es-ES", opcionesFecha);
                setDayprev(fecha.getDate());
                setMonthprev(fecha.getMonth() +1);
                setYearprev(fecha.getFullYear());
                setDate_born(formatoEntendible)
                setPassword(result[0].contraseña)
                setFollowers(result[0].totalFollowers)
                setTime_rep(result[0].t_reproduccion)
                setTipoAuth(result[0].tipoAuth)
                setAuth(result[0].auth)
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

    const updateinfo = async () => {
        console.log("updateinfo")
        try {
            if (name === "") {
                toast.error("Nombre vacio", {
                    position: toast.POSITION.BOTTOM_RIGHT
                });

                return;
            }
            if (mail === "") {
                toast.error("Correo vacio", {
                    position: toast.POSITION.BOTTOM_RIGHT
                });

                return;
            }
            //* validacion de fecha
            var fechaenviar;
            if (day === "" || month === "" || year === "") {
                fechaenviar = yearprev + "-" + monthprev + "-" + dayprev;
            }else{
                fechaenviar = year + "-" + month + "-" + day;
            }
            //* validacion de password
            var encryptedPassword;
            if (newPassword === "") {
                //encriptado password
                encryptedPassword = AES.encrypt(password, process.env.REACT_APP_CRYPTO_KEY).toString()
            }else{
                encryptedPassword = AES.encrypt(newPassword, process.env.REACT_APP_CRYPTO_KEY).toString()
            }
            const data = {
                token: (sessionStorage.getItem("token")),
                nombre: name,
                correo: mail,
                fecha_nacimiento: fechaenviar,
                password: encryptedPassword,
                tipoAuth: tipoAuth,
                auth: auth

            };

            console.log(data);
            const result = (await axios.post(`${process.env.REACT_APP_API_URL}api=usuario&id=editprofile`, data, auth)).data;
            console.log(result);

            if (result.success) {

                toast.success( result.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            } else {
                toast.error(result.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }
        } catch (error) {
            toast.error("",error.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    };
    const handleChange = (event) => {
        if (event.target.checked) {
            setActivarguardado2(false);
            setAuth(1);
        }else{
            setActivarguardado2(true);
            setAuth(0);
        }
    }
    return (
        <>
            <section>
                <div className="containerProfile">
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h2" color="black" align="center">
                                Editar Perfil
                            </Typography>
                            <hr />
                            {/* <div className="row center-content borderRating">
                                <div className="col s1 center-content">
                                    <FavoriteIcon sx={{ fontSize: 50, color: "red", marginLeft: "30%" }} />
                                    <i className="material-icons medium yellow-text text-darken-3">{500} seguidores</i>
                                </div>
                                <div className="col s5 center-align">
                                    <WatchLaterIcon sx={{ fontSize: 50, color: "blue" }} />
                                    <i className="material-icons medium yellow-text text-darken-3">{14} horas {27} minutos reproducidos</i>
                                </div>
                            </div> */}
                            {/* <br /> */}
                        </Grid>
                        <Grid item xs={5} sm={8} md={6} lg={8} xl={3} sx={{ margin: "0 auto" }}>
                            <form>
                                <Grid container spacing={2} >
                                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                                        {/* <h3 className="center-align">Nombre:  </h3> */}
                                        <TextField
                                            fullWidth
                                            label="NOMBRE"
                                            InputProps={{
                                                startAdornment: <Person />,
                                                className: "black-text"
                                            }}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                                        <TextField
                                            fullWidth
                                            label="CORREO"
                                            InputProps={{
                                                startAdornment: <Markunread />,
                                                className: "black-text"
                                            }}
                                            error={activarmail}
                                            helperText={textactivermail}
                                            value={mail}
                                            onChange={(e) => {
                                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                                if(emailRegex.test(e.target.value)){
                                                    setActivarmail(false)
                                                    setTextactivermail("Correo electronico Valido");
                                                }else{
                                                    setActivarmail(true)
                                                    setTextactivermail("Correo electronico NO Valido");
                                                }
                                                setMail(e.target.value)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="day-label">Día {dayprev}</InputLabel>
                                            <Select
                                                labelId="day-label"
                                                value={day}
                                                onChange={(e) => setDay(e.target.value)}
                                                className="black-text"
                                            >
                                                {/* Opciones para los días */}
                                                {/* Por ejemplo, del 1 al 31 */}
                                                {Array.from({ length: 31 }, (_, index) => index + 1).map((dayValue) => (
                                                    <MenuItem key={dayValue} value={dayValue}>{dayValue}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth>
                                            <InputLabel id="month-label">Mes {monthprev}</InputLabel>
                                            <Select
                                                labelId="month-label"
                                                value={month}
                                                onChange={(e) => setMonth(e.target.value)}
                                                className="black-text"
                                            >
                                                {/* Opciones para los meses */}
                                                {/* Por ejemplo, de enero a diciembre */}
                                                {Array.from({ length: 12 }, (_, index) => index + 1).map((monthValue) => (
                                                    <MenuItem key={monthValue} value={monthValue}>{monthValue}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth>
                                            <InputLabel id="year-label">Año {yearprev}</InputLabel>
                                            <Select
                                                labelId="year-label"
                                                value={year}
                                                onChange={(e) => setYear(e.target.value)}
                                                className="black-text"
                                            >
                                                {/* Opciones para los años */}
                                                {/* Por ejemplo, desde 1900 hasta el año actual */}
                                                {Array.from({ length: new Date().getFullYear() - 1899 }, (_, index) => new Date().getFullYear() - index).map((yearValue) => (
                                                    <MenuItem key={yearValue} value={yearValue}>{yearValue}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                                        <TextField
                                            fullWidth
                                            label="CONTRASENA"
                                            type="password"
                                            InputProps={{
                                                startAdornment: <VisibilityOff />,
                                                className: "black-text"
                                            }}
                                            value={oldPassword}
                                            onChange={(e) => {
                                                
                                                // Realizar validaciones adicionales de la contraseña aquí
                                                console.log(password)
                                                console.log(oldPassword)
                                                if (e.target.value === password) {
                                                    setOldPasswordError(false);
                                                    setOldPasswordHelperText("Contrasena correcta");
                                                    setActivarguardado(false);
                                                } else {
                                                    setOldPasswordError(true);
                                                    setOldPasswordHelperText("Contrasena no es correcta");
                                                    setActivarguardado(true);
                                                }
                                                // Actualizar el estado con la nueva contraseña
                                                setOldPassword(e.target.value);
                                            }}
                                            error={oldPasswordError}
                                            helperText={oldPasswordHelperText}
                                        />
                                        <i >por favor escriba su contrasena, Para actualizar. </i>
                                    </Grid>
                                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                                        <TextField
                                            fullWidth
                                            disabled={Activarguardado}
                                            label="NUEVA CONTRASENA"
                                            type="password"
                                            InputProps={{
                                                startAdornment: <VisibilityOff />,
                                                className: "black-text"
                                            }}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />

                                        <Button
                                            disabled={Activarguardado}
                                            variant="contained"
                                            color="success"
                                            startIcon={<ChangeCircle />}
                                            fullWidth
                                            // href="#changeUbication"
                                            sx={{ width: '45%' }}
                                            onClick={updateinfo}
                                        >
                                            GUARDAR CAMBIOS
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                                        <Typography variant="h6" gutterBottom component="div" sx={{ display: "flex", alignItems: "center" }}>
                                            <i className="material-icons medium yellow-text text-darken-3"> Two-Factor Authentication  </i>
                                        </Typography>
                                        <Checkbox
                                            disabled={Activarguardado}

                                        checked={auth}
                                        onChange={handleChange}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                        <FormControl sx={{ width: '45%' }} 
                                            disabled={Activarguardado2}
                                            >
                                            {/* <InputLabel id="envio">Seleccionar Metodo de Envio</InputLabel>
                                            <Select
                                                labelId="envio"
                                                value={checked}
                                                label="Age"
                                                onChange={handleChange}
                                                className="black-text"
                                            >
                                                <MenuItem value="">Mensaje de Texto</MenuItem>
                                                <MenuItem value={10}>Correo Electronico</MenuItem>
                                                <MenuItem value={20}>Twenty</MenuItem>
                                                <MenuItem value={30}>Thirty</MenuItem>
                                            </Select> */}

                                            <InputLabel id="year-label">Seleccionar Metodo de Envio</InputLabel>
                                            <Select
                                                labelId="year-label"
                                                value={tipoAuth}
                                                onChange={(e) => setTipoAuth(e.target.value)}
                                                className="black-text"
                                            >
                                                <MenuItem value={1} key={1}>Mensaje de Texto</MenuItem>
                                                <MenuItem value={2} key={2}>Correo Electronico</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                    </Grid>
                    <br />
                    <br />
                </div>
            </section>
            <ToastContainer/>
        </>
    );
}