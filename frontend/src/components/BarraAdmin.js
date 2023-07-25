import React from "react";
import AlbumIcon from '@mui/icons-material/Album';
import { Link } from "react-router-dom";
export class BarraAdmin extends React.Component {

    cerrarSesion = (e) => {
        sessionStorage.clear()
        window.location.href = '/login'
    }

    render() {
        return (
            <nav class="navbar navbar-expand-lg" style={{ backgroundColor: '#223263' }}>
                <div class="container-fluid">
                    <Link class="navbar-brand" to="#" style={{ color: '#f8eb25' }}><AlbumIcon style={{ color: "#f8eb25" }} /> AyDisco</Link>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">

                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <Link class="nav-link active" aria-current="page" to="/admin" style={{ color: '#f8eb25' }}>Administrar Solicitudes</Link>
                            </li>
                            <br />
                            <li class="nav-item">
                                <Link class="nav-link active" aria-current="page" to="/admin/usuarios" style={{ color: '#f8eb25' }}>Administrar Usuarios</Link >
                            </li>
                            <br />
                            <li class="nav-item">
                                <Link class="nav-link active" aria-current="page" to="/admin/Reportes" style={{ color: '#f8eb25' }}>Ver Reportes</Link>
                            </li>
                        </ul>

                        <form class="d-flex">
                            {/* <button class="btn" style={{ color: '#f8eb25', border: '2px solid #f8eb25' }} type="submit" onClick={this.cerrarSesion}>Cerrar Sesion</button> */}
                            <Link class="btn" style={{ color: '#f8eb25', border: '2px solid #f8eb25' }} type="submit" onClick={this.cerrarSesion} to="/" className="nav-link text-white"> CERRAR SESION </Link>
                        </form>

                    </div>
                </div>
            </nav>
        )
    }
}