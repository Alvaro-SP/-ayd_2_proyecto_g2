import React from "react";
import AlbumIcon from '@mui/icons-material/Album';
import { Link } from "react-router-dom";
export class BarraInicio extends React.Component {
    render() {
        return (
            <nav class="navbar navbar-expand-lg" style={{backgroundColor:'#223263'}}>
                <div class="container-fluid">
                    <Link class="navbar-brand" to="#" style={{ color: '#f8eb25' }}><AlbumIcon style={{ color: "#f8eb25" }} /> AyDisco</Link>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <Link class="nav-link active" aria-current="page" to="/registro" style={{ color: '#f8eb25' }}>Registro</Link>
                            </li>
                            <li class="nav-item">
                                <Link class="nav-link active" aria-current="page" to="/login" style={{ color: '#f8eb25' }}>Login</Link>
                            </li>
                        </ul>

                    </div>
                </div>
            </nav>
        )
    }
}