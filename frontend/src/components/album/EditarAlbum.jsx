import React, { useState, useEffect } from 'react';
import { BarraUsuario } from '../BarraUsuario';
import jwt_decode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import backgroundImage from "../../images/back.jpg";
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Select,
  MenuItem,
  Card,
  CardContent,
  InputLabel,
  FormControl
} from '@mui/material';
import axios from 'axios';

import '../../styles/EditarAlbum.css';

const EditarAlbum = () => {
  const [albumNombre, setAlbumNombre] = useState('');
  const [canciones, setCanciones] = useState([]);
  const [cancionesAgregadas, setCancionesAgregadas] = useState([]);
  const [cancionesSinAlbum, setCancionesSinAlbum] = useState([]);
  const [cancionesEliminadas, setCancionesEliminadas] = useState([]);
  const [cancionesSeleccionadas, setCancionesSeleccionadas] = useState([]);
  const [albumDestino, setAlbumDestino] = useState('');
  const [nuevaCancion, setNuevaCancion] = useState('');
  const [cancionNueva, setCancionNueva] = useState([]);
  const [albumsUsuario, setAlbumsUsuario] = useState([]);
  const [imagenNueva, setImagenNueva] = useState('');
  const [imagenAlbum, setImagenAlbum] = useState('');
  const [idUsuario, setIdUsuario] = useState('');
  const [idAlbum, setIdAlbum] = useState('');

  let iduser = '';
  let album = '';
  const url = `${process.env.REACT_APP_API_URL}api=cancion&id=canciones`;
  const url2 = `${process.env.REACT_APP_API_URL}api=cancion&id=sinalbum`;
  const url3 = `${process.env.REACT_APP_API_URL}api=album&id=editar`;

  const verificarRol = (token) => {
    const Tipo = jwt_decode(token);
    const expiracion = Tipo.exp;
    console.log(Tipo);
    iduser = Tipo.id
    if (expiracion < Date.now() / 1000) {
      sessionStorage.clear();
      toast.warning('Su sesión ha expirado', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    }
  };

  useEffect(() => {
    //obtener info desde localstorage
    const token = sessionStorage.getItem('token');
    if (token !== null) {
      verificarRol(token);
    } else {
      window.location.href = '/login';
      return;
    }
    const albumselected = JSON.parse(localStorage.getItem('albumselected'));
    const albumsofuser = JSON.parse(localStorage.getItem('albumsofuser'));
    setAlbumNombre(albumselected[0].nombre);
    setImagenAlbum(albumselected[0].imglink);
    setIdAlbum(albumselected[0].idALBUM);
    album = albumselected[0].idALBUM;
    setAlbumsUsuario(albumsofuser);

    // Lógica para obtener las canciones del álbum seleccionado
    const fetchData = async () => {
      const response = await axios.get(`${url}&id_user=${iduser}&id_album=${album}`);
      console.log(response.data);
      setCanciones(response.data);
    };
    fetchData();

    //fetch para obtener canciones sin album
    const fetchData2 = async () => {
      const response = await axios.get(url2);
      //setCancionesSinAlbum(response.data);
      //console.log('canciones sin album: ', response.data);
      setCancionesSinAlbum(response.data);
    };
    fetchData2();
  }, []);

  // Lógica para cargar datos del usuario, canciones, albums, etc.

  const handleAlbumNombreChange = (event) => {
    setAlbumNombre(event.target.value);
  };

  const handleCheckboxChange = (cancionId) => {
    // Lógica para marcar/desmarcar la canción seleccionada
    console.log('se selecciono: ', cancionId);
    const newCancionesSeleccionadas = cancionesSeleccionadas.includes(cancionId)
      ? cancionesSeleccionadas.filter((cancion) => cancion !== cancionId)
      : [...cancionesSeleccionadas, cancionId];
    setCancionesSeleccionadas(newCancionesSeleccionadas);
    console.log('canciones seleccionadas: ', cancionesSeleccionadas);

  };

  const handleEliminarCancion = (cancionId) => {
    // Lógica para eliminar la canción seleccionada
    console.log('se selecciono: ', cancionId);
    //agregar cancion a array canciones sin album:
    const cancion = canciones.find((cancion) => cancion.id === cancionId);
    //agregar claves de objeto cancion
    cancion.idCANCION = cancion.id;
    cancion.nombre_cancion = cancion.nombre;
    setCancionesSinAlbum([...cancionesSinAlbum, cancion]);
    setCancionesEliminadas([...cancionesEliminadas, cancion]);
    //eliminar cancion de array canciones:
    const newCanciones = canciones.filter((cancion) => cancion.id !== cancionId);
    setCanciones(newCanciones);



  };

  const handleAlbumDestinoChange = (event) => {
    console.log('se selecciono: ', event.target.value);
    setAlbumDestino(event.target.value);
  };

  const handleImagenAlbumChange = (event) => {
    const file = event.target.files[0];


    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = (e.target.result);
        setImagenAlbum(base64Image);
        setImagenNueva(base64Image);
      };
      reader.readAsDataURL(file);
      console.log('imagen en base64: ', imagenAlbum);
    }


  };



  const handleModificarAlbum = () => {
    console.log('se presiono modificar album');
    const fetchdata3 = async () => {
      const requestBody = {
        idAlbumOrigen: idAlbum,
        nombreAlbum: albumNombre,
        nuevasCanciones: cancionesAgregadas,
        cancionesEliminadas: cancionesEliminadas,
        cancionesSeleccionadas: cancionesSeleccionadas,
        idAlbumDestino: albumDestino,
        imagenAlbum: imagenNueva,
      };
  
      const response = await axios.post(url3, requestBody);
      console.log(response);
  
      if (response.data.data === 'success') {
        toast.success('Album modificado con éxito', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
  
        setTimeout(() => {
          window.location.href = '/usuario';
        }, 3000);
      }
    };
  
    fetchdata3();
  };
  

  const agregarCancion = (event) => {
    // Obtener el ID de la canción seleccionada
    console.log('se selecciono: ', event.target.value);
    setNuevaCancion(event.target.value); // Actualizar el estado nuevaCancion con el ID seleccionado
    const cancion = cancionesSinAlbum.find((cancion) => cancion.idCANCION === event.target.value);
    //agregar claves de objeto cancion
    cancion.id = cancion.idCANCION;
    cancion.nombre = cancion.nombre_cancion;
    setCancionNueva(cancion);
  };


  const agregarCancionNueva = () => {
    // Lógica para agregar la canción seleccionada al album
    console.log('se selecciono: ', cancionNueva);
    setCanciones([...canciones, cancionNueva]);
    setCancionesAgregadas([...cancionesAgregadas, cancionNueva]);
    //eliminar cancion de array de canciones sin album
    setCancionesSinAlbum(cancionesSinAlbum.filter((cancion) => cancion.idCANCION !== cancionNueva.idCANCION));
  };

  return (
    <div className="cgeneral" style={{
      backgroundImage: `url(${backgroundImage})`
  }}>
      <BarraUsuario className="barra-usuario" />
      <div
        className="inicio-usuario-container"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
      <Container className="editar-album-container" style={{ padding: '16px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Nombre del álbum"
              color="success"
              focused
              value={albumNombre}
              onChange={handleAlbumNombreChange}
              fullWidth
              variant="outlined"
              inputProps={{
                style: { color: '#fff' },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <h5 style={{ color: 'white' }}>Agregar nueva canción a album</h5>
            <FormControl color="success" fullWidth>
              <InputLabel id="ddemo-simple-select-label">Seleccionar Canción</InputLabel>
              <Select
                labelId="ddemo-simple-select-label"
                label="Seleccionar Canción"
                value={nuevaCancion}
                onChange={agregarCancion}
                style={{ width: '100%', marginBottom: '16px', backgroundColor: '#fff' }}
              >
                {cancionesSinAlbum.map((cancion) => (
                  <MenuItem key={cancion.idCANCION} value={cancion.idCANCION}>
                    {cancion.nombre_cancion}
                  </MenuItem>
                ))}
              </Select>
              <Button variant="contained" color="primary" onClick={agregarCancionNueva} style={{ marginTop: '16px' }}>
                Agregar canción
              </Button>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <h5 style={{ color: 'white' }}>Listado de canciones en album</h5>
            <TableContainer className="editar-album-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Seleccionar</TableCell>
                    <TableCell>Canción</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {canciones.map((cancion) => (
                    <TableRow key={cancion.id}>
                      <TableCell>
                        <Checkbox
                          checked={cancion.seleccionada}
                          onChange={() => handleCheckboxChange(cancion.id)}
                          sx={{
                            color: '#fff',
                          }}
                        />
                      </TableCell>
                      <TableCell>{cancion.nombre}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleEliminarCancion(cancion.id)}>Eliminar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <h5 style={{ color: 'white' }}>Migrar canciones seleccionadas a otro album</h5>
            <FormControl color="success" fullWidth>
              <InputLabel id="demo-simple-select-label">Seleccionar Album Destino</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                label="Seleccionar Album Destino"
                value={albumDestino}
                onChange={handleAlbumDestinoChange}
                style={{ width: '100%', marginBottom: '16px', backgroundColor: '#fff' }}
              >
                {albumsUsuario.map((album) => (
                  <MenuItem key={album.idALBUM} value={album.idALBUM}>
                    {album.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <div className="editar-album-image-container">
              <img src={imagenAlbum} alt="Imagen del álbum" className="editar-album-image" />
            </div>
            <div className="editar-album-button-container">
              <input type="file" onChange={handleImagenAlbumChange} accept="image/*" style={{ display: 'none' }} />
              <Button variant="outlined" component="label">
                Cambiar portada de album
                <input type="file" onChange={handleImagenAlbumChange} accept="image/*" style={{ display: 'none' }} />
              </Button>
            </div>
          </Grid>
          <Grid item xs={12} className="editar-album-button-container">
            <Button
              onClick={handleModificarAlbum}
              className="editar-album-button"
              variant="contained"
              color="primary"
            >
              Modificar álbum
            </Button>
          </Grid>
        </Grid>
      </Container>
      </div>
    </div>
  );
};

export default EditarAlbum;
