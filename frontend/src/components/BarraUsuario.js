import React, { useState } from "react";
import AlbumTwoToneIcon from '@mui/icons-material/AlbumTwoTone';
import "../styles/BarraUsuario.css";

export function BarraUsuario() {
    const cerrarSesion = async () => {
      sessionStorage.clear();
    };
  
    return (
      <>
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <a className="navbar-brand" href="/usuario">
              <AlbumTwoToneIcon className="brand-icon" /> AyDisco
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/usuario">
                    Albums
                  </a>
                </li>
  
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/crearalbum" name="crearalbumgood">
                    Crear Album
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/profile">
                    Ver Perfil
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/buscar">
                    Buscar
                  </a>
                </li>
  
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/subirCancion">
                    Subir Cancion
                  </a>
                </li>
              </ul>
              <form className="d-flex">
                <a
                  className="btnn"
                  name="logout"
                  onClick={cerrarSesion}
                  href="/"
                >
                  CERRAR SESION
                </a>
              </form>
            </div>
          </div>
        </nav>
      </>
    );
  }