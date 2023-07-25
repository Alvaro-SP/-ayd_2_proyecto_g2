import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserComponent from "./UserComponent";
// import { EditarPerfil } from "./EditarPerfil";
import { BarraUsuario } from "../BarraUsuario";
import "../../styles/usuario/BuscarUsuario.css";
import logo from "../../shared/logo.gif";
import axios from "axios";
import M from "materialize-css";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import PlayerFooter from "../PlayerFooter";
import { Container, Grid, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import { Typography, Box } from "@mui/material";
import backgroundImage from '../../images/back.jpg'
export function Buscar() {
  const [busqueda, setBusqueda] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [logItems, initLog] = useState([])
  var datosAlbum = { id_usuario: 0, id_album: 0 };

  const albums = [{}];
  const fetchData = async () => {
    const data = {
      token: sessionStorage.getItem("token")
    }
    try {
      console.log(data)
      const result = (await axios.post(`${process.env.REACT_APP_API_URL}api=usuario&id=usuarios`, data)).data

      if (result) {
        console.log(result)
        setUsuarios(result)
        setFiltrados(result)
      } else {
        toast.error(result.message, {
          position: toast.POSITION.TOP_CENTER
        });
      }
    } catch (error) {
      console.log(error)
      toast.error("Su sesion ha expirado!, codigo: " + error.message, {
        position: toast.POSITION.TOP_CENTER
      });
    }
  };
  useEffect(() => {
    fetchData()
  }, []);

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const handleEditAlbum = async (id) => {
    const data = {
      token: sessionStorage.getItem("token"),
      id_seguido: id
    }
    try {
      console.log(data)
      const result = (await axios.post(`${process.env.REACT_APP_API_URL}api=usuario&id=follow`, data)).data

      if (result) {
        console.log(result)
        alert(result.message)
        toast.success(result.message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
        fetchData()
      } else {
        toast.error(result.message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    } catch (error) {
      console.log(error)
      toast.error("Su sesion ha expirado!, codigo: " + error.message, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }

  };


  const handleEditAlbumd = async (id) => {
    const data = {
      token: sessionStorage.getItem("token"),
      id_seguido: id
    }
    try {
      console.log(data)
      const result = (await axios.post(`${process.env.REACT_APP_API_URL}api=usuario&id=unfollow`, data)).data

      if (result) {
        console.log(result)
        alert(result.message)
        toast.success(result.message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
        fetchData()
      } else {
        toast.error(result.message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    } catch (error) {
      console.log(error)
      toast.error("Su sesion ha expirado!, codigo: " + error.message, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }

  };

  const verificarRol = (token) => {
    const Tipo = jwt_decode(token);
    const expiracion = Tipo.exp;
    console.log(Tipo);
    if (expiracion < Date.now() / 1000) {
      sessionStorage.clear();
      toast.warning("Su sesion ha expirado", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    }
    if (Tipo.tipo != 1) {
      window.location.href = "/accessDenied";
    }
  };

  const problema = async (error) => {
    toast.warning(error, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
    await sleep(3000);
    window.history.back();
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


  const handleChange = (e) => {
    const inputValue = e.target.value;
    setBusqueda(inputValue);

    const filterUsers = () => {
      if (inputValue !== "") {
        return usuarios.filter((user) => {
          return user.nombre
            .toLowerCase()
            .includes(inputValue.toLowerCase());
        });
      } else {
        return usuarios;
      }
    };

    const filteredUsers = filterUsers();
    setFiltrados(filteredUsers);
  };

  const verAlbums = async (id) => {
    window.location.href = "/albums";
  };

  return (
    <div className="cgeneral" style={{
      backgroundImage: `url(${backgroundImage})`
    }}>

      <BarraUsuario />

      {/* <Grid container spacing={2} className="album-grid">
            {albums.map((album) => (
              <Grid item key={album.idALBUM}>
                <UserComponent
                  userName={"nombreusuario"}
                  id={"idusuario"}
                  onDeleteAlbum={handleDeleteAlbum}
                  onEditAlbum={handleEditAlbum}
                />
              </Grid>
            ))}
          </Grid> */}
      <div className="inicio-usuario-container" style={{ backgroundImage: `url(${backgroundImage})` }} >
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h4" color="white" align="center">
              BUSCAR USUARIOS:
            </Typography>
          </Grid>
        </Grid>
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar un Usuario"
            value={busqueda}
            onChange={handleChange}
          />
          {/* <button className="search-button">Buscar</button> */}
        </div>
        <Typography variant="h5" color="white" align="center"> Seguidos: </Typography>
        <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ padding: '3%' }} className="grid-container">
          <Grid item xs={12}>
            <Container className="album-container">
              <br />
              {albums.length === 0 ? (
                <div className="no-albums-message">Aún no sigues a ningun usuario</div>
              ) : (
                <Grid container spacing={2} className="album-grid">
                  {filtrados.map((album) => (
                    <Grid item key={album.id}>
                      {album.esSeguido === 1 && (
                      <UserComponent userName={album.nombre} userImage={album.imglink} id={album.id} onEditAlbum={handleEditAlbum} showfollowbutton={false} showViewButton={true} />
                      )}
                      </Grid>
                  ))}
                </Grid>
              )}
              <br />
            </Container>
          </Grid>
        </Grid>
        <Typography variant="h5" color="white" align="center"> Usuarios en el Sistema: </Typography>
        <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ padding: '3%' }} className="grid-container">
          <Grid item xs={12}>
            <Container className="album-container">
              <br />
              {albums.length === 0 ? (
                <div className="no-albums-message">Aún no hay usuarios</div>
              ) : (
                <Grid container spacing={2} className="album-grid">
                  {filtrados.map((album) => (
                    <Grid item key={album.id}>
                      {album.esSeguido === 0 && (
                      <UserComponent userName={album.nombre} userImage={album.imglink} id={album.id} onEditAlbum={handleEditAlbum} onunfollow={handleEditAlbumd} showfollowbutton={true} showViewButton={false} />
                      )}
                    </Grid>
                  ))}
                </Grid>
              )}
              <br />
            </Container>
          </Grid>
        </Grid>

      </div>

    </div>
  );
}
