import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Topsongs } from "./Topsongs";
import { Topfollowers } from "./Topfollowers";
import { Toptimelisten } from "./Toptimelisten";
// import { EditarPerfil } from "./EditarPerfil";
import { BarraAdmin } from "../BarraAdmin";
import "../../styles/usuario/SidebarUsuario.css";
import logo from "../../shared/logo.gif";
import M from "materialize-css";
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import PlayerFooter from "../PlayerFooter";

export function SidebarReport() {
    const [valPrev, setValPrev] = useState(-1);

    const [colorText, setColorText] = useState([
        "green-text text-darken-2",
        "green-text text-darken-2",
        "green-text text-darken-2",
    ]);

    const [colores, setColores] = useState(["white", "white", "white"]);
    const tooltipColor = getComputedStyle(document.documentElement).getPropertyValue('--tooltip-color');
    const [mostrarVerPerfil, setMostrarVerPerfil] = useState(null);

    const handleMostrarMasreproducidas = () => {
        setMostrarVerPerfil(null);
    };
    const handleMostrarMasSeguidores = () => {
        setMostrarVerPerfil(true);
    };
    const handleMostrarMastiempo = () => {
        setMostrarVerPerfil(false);
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
           
            <BarraAdmin />

            {/* <VerPerfil /> */}
            <aside>
                <ul id="sideRep" className="sidenav sidenav-fixed">
                    <li className="center-contentsidebar">
                        <img
                            src={"https://cdn-icons-png.flaticon.com/512/8713/8713095.png"}
                            alt="logo"
                            className="tooltipped"
                            data-position="center"
                            data-tooltip="Al Chilazo"
                            style={{ width: "60%", paddingTop: "15px", align: "center" }}
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
                            style={{ display: "flex", justifyContent: "flex-start" }}
                            onClick={handleMostrarMasreproducidas}
                        >
                            <HeadsetMicIcon />
                            <i
                                className={
                                    "material-icons iconSizeRepartidor " + colorText[0]
                                }
                                style={{ marginLeft: "0.8rem" }}
                            >
                                canciones más reproducidas
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
                            onClick={handleMostrarMasSeguidores}
                        >
                            <PersonAddAltIcon />
                            <i
                                className={"material-icons iconSizeRepartidor " + colorText[1]}
                                style={{ marginLeft: "0.8rem" }} // Agrega margen izquierdo para separar el ícono y el texto
                            >
                                usuarios con más seguidores
                            </i>
                        </Link>
                    </li>
                    <br />
                    <li>
                        <Link
                            // to="/profile"
                            className={"iconContinerSideRep tooltipped " + colores[0]}
                            data-position="right"
                            data-tooltip="Vista General de la Cuenta"
                            style={{ display: "flex", justifyContent: "flex-start" }}
                            onClick={handleMostrarMastiempo}
                        >
                            <MoreTimeIcon />
                            <i
                                className={
                                    "material-icons iconSizeRepartidor " + colorText[0]
                                }
                                style={{ marginLeft: "0.8rem" }}
                            >
                                usuarios con más tiempo
                                de canciones reproducidas
                            </i>
                        </Link>
                    </li>
                    <br />
                </ul>
            </aside>
            {mostrarVerPerfil === null ? <Topsongs /> : mostrarVerPerfil ? <Topfollowers /> : <Toptimelisten />}


        </>
    );
}