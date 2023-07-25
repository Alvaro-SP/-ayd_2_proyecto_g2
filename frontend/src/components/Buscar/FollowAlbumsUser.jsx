import React, { useState, useEffect } from "react";
import { BarraUsuario } from "../BarraUsuario";
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlbumComponentShared from "../album/AlbumComponentShared";
import { Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import backgroundImage from "../../images/back.jpg";
import "../../styles/InicioUsuario.css";
import CircularProgress from "@mui/material/CircularProgress";

const FollowAlbumsUser = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idUser, setIdUser] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtrados, setFiltrados] = useState([]);
  const data = {
    idUser: "",
  };
  const url = `${process.env.REACT_APP_API_URL}api=album&id=listar`;

  const verificarRol = (token) => {
    const Tipo = jwt_decode(token);
    const expiracion = Tipo.exp;
    console.log(Tipo);
    //data.idUser = Tipo.id;
    data.idUser = JSON.parse(localStorage.getItem("asl"));
    if (expiracion < Date.now() / 1000) {
      sessionStorage.clear();
      toast.warning("Su sesión ha expirado", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token !== null) {
      verificarRol(token);
    } else {
      window.location.href = "/login";
      return;
    }

    const fetchData = async () => {
      // try {
        console.log("Esto hay en idFollowUser: ", data);
        const response = await axios.post(url, data);
        setAlbums(response.data.albums);
        setFiltrados(response.data.albums);
        setLoading(false);
        console.log("Esto hay en albums: ", albums);
      // } catch (error) {
      //   console.error("Error al obtener los álbumes:", error);
      //   // Redirigir a otra página
      //   window.location.href = "/accessDenied";
      // }
    };
    fetchData();
  }, []);

  const DisplayAlbum = (albumId) => {
    localStorage.setItem(
      "albumVisualizado",
      JSON.stringify(albumId)
    );
  };
  const handleChange = (e) => {
    const inputValue = e.target.value;
    setBusqueda(inputValue);

    const filterUsers = () => {
      if (inputValue !== "") {
        return albums.filter((album) => {
          return album.nombre
            .toLowerCase()
            .includes(inputValue.toLowerCase());
        });
      } else {
        return albums;
      }
    };

    const filteredUsers = filterUsers();
    setFiltrados(filteredUsers);
  };

  if (loading) {
    return (
      <div
        className="inicio-usuario-container"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <BarraUsuario className="barra-usuario" />
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: "100vh" }}
        >
          <CircularProgress />
        </Grid>
      </div>
    );
  }

  return (
    <div className="cgeneral" style={{
      backgroundImage: `url(${backgroundImage})`
  }}>
      
      <BarraUsuario className="barra-usuario" />
      <br/>
      <div
        className="inicio-usuario-container"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h4" color="white" align="center">
              BUSCA TUS ALBUMS
            </Typography>
          </Grid>
        </Grid>
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Ingresa el nombre del album"
            value={busqueda}
            onChange={handleChange}
          />
          {/* <button className="search-button">Buscar</button> */}
        </div>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          style={{ padding: "3%" }}
          className="grid-container"
        >
          <Grid item xs={12}>
            <Container className="album-container">
              <br />
              {albums.length === 0 ? (
                <div className="no-albums-message">Aún no tienes álbumes</div>
              ) : (
                
                <Grid container spacing={2} className="album-grid">
                  {filtrados.map((album) => (
                    <Grid item key={album.idALBUM}>
                      <AlbumComponentShared 
                        albumName={album.nombre}
                        albumImage={album.imglink}
                        id={album.idALBUM}
                        onDisplayAlbum = {DisplayAlbum}
                      />
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
};

export default FollowAlbumsUser;
