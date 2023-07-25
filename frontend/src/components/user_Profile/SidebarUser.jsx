import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { VerPerfil } from "./VerPerfil";
import { EditarPerfil } from "./EditarPerfil";
// import { EditarPerfil } from "./EditarPerfil";
import { BarraUsuario } from "../BarraUsuario";
import "../../styles/usuario/SidebarUsuario.css";
import logo from "../../shared/logo.gif";
import M from "materialize-css";
import HomeIcon from '@mui/icons-material/Home';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import PlayerFooter from "../PlayerFooter";
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
export function SidebarUser() {
    const [valPrev, setValPrev] = useState(-1);

    const [colorText, setColorText] = useState([
        "green-text text-darken-2",
        "green-text text-darken-2",
        "green-text text-darken-2",
    ]);

    const [colores, setColores] = useState(["white", "white", "white"]);
    const tooltipColor = getComputedStyle(document.documentElement).getPropertyValue('--tooltip-color');
    const [mostrarVerPerfil, setMostrarVerPerfil] = useState(true);
    var datosAlbum = { id_usuario: 0, id_album: 0 };
    const handleMostrarEditarPerfil = () => {
        setMostrarVerPerfil(false);
    };

    const handleMostrarVerPerfil = () => {
        setMostrarVerPerfil(true);
    };
    useEffect(() => {
        var elems = document.querySelectorAll(".tooltipped");
        M.Tooltip.init(elems, {
            inDuration: 200,
            outDuration: 200,
        });

        var elems = document.querySelectorAll(".sidenav");
        M.Sidenav.init(elems, {
            draggable: true,
        });
    }, []);
    useEffect(() => {
        const tooltips = document.querySelectorAll('.tooltipped');
        tooltips.forEach((tooltip) => {
            tooltip.setAttribute('data-tooltip', tooltipColor);
        });
    }, [tooltipColor]);
    const verificarRol = (token) => {
        const Tipo = jwt_decode(token);
        const expiracion = Tipo.exp;
        console.log(Tipo);
        if (expiracion < Date.now() / 1000) {
            sessionStorage.clear();
            toast.warning("Su sesion ha expirado", {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 2000,
            });
            setTimeout(() => {
            window.location.href = "/login";
            }, 3000);
        }
        if (Tipo.tipo != 1) {
            sessionStorage.clear();
            window.location.href = "/accessDenied";
        }
    };
    const token = sessionStorage.getItem("token");
    if (token !== null) {
        verificarRol(token);

        const id = parseInt(window.location.pathname.split("/")[2]);
        const Tipo = jwt_decode(token);
        datosAlbum = { id_usuario: Tipo.id, id_album: id };
    } else {
        window.location.href = "/login";
        return;
    }
    const changeColor = (value) => {
        var newColores = colores;
        var newColorText = colorText;

        if (valPrev !== -1) {
            if (valPrev !== value) {
                newColores[valPrev] = "white";
                newColorText[valPrev] = "green-text text-darken-2";
            }
        }

        newColorText[value] = "white-text";
        newColores[value] = "green darken-2";

        setColorText(newColorText);
        setColores(newColores);
        setValPrev(value);
    };

    return (
        <>
            <BarraUsuario />

            {/* <VerPerfil /> */}
            <aside>
                <ul id="sideRep" className="sidenav sidenav-fixed">
                    <li className="center-content">
                        <img
                            src={"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                            alt="logo"
                            className="tooltipped"
                            data-position="right"
                            data-tooltip="Al Chilazo"
                            style={{ width: "80%", paddingTop: "15px" }}
                        />
                    </li>
                    <br />
                    <br />
                    <li>
                        <Link
                            // to="/profile"
                            className={"iconContinerSideRep tooltipped " + colores[0]}
                            data-position="right"
                            data-tooltip="Vista General de la Cuenta"
                            style={{ display: "flex", justifyContent: "center" }}
                            onClick={handleMostrarVerPerfil}
                        >
                            <HomeIcon />
                            <i
                                className={
                                    "material-icons iconSizeRepartidor " + colorText[0]
                                }
                                style={{ marginLeft: "0.8rem" }}
                            >
                                Vista General de la Cuenta
                            </i>
                        </Link>
                    </li>
                    <br />

                    <li>
                        <Link
                            // to="/EditarPerfil"
                            className={"iconContinerSideRep tooltipped " + colores[1]}
                            data-position="right"
                            data-tooltip="Pedidos Pendientes"
                            style={{ display: "flex", justifyContent: "flex-start" }} // Modificación en esta línea
                            onClick={handleMostrarEditarPerfil}
                        >
                            <BorderColorIcon />
                            <i
                                className={"material-icons iconSizeRepartidor " + colorText[1]}
                                style={{ marginLeft: "0.8rem" }} // Agrega margen izquierdo para separar el ícono y el texto
                            >
                                Editar Perfil
                            </i>
                        </Link>
                    </li>
                </ul>
            </aside>
            {mostrarVerPerfil ? <VerPerfil /> : <EditarPerfil />}

        </>
    );
}