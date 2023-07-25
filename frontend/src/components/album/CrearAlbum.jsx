import React, { useState } from 'react';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, Card, CardMedia } from '@mui/material';
import { BarraUsuario } from '../BarraUsuario';
import '../../styles/CrearAlbum.css'; // Importa el archivo CSS
import { useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';
import backgroundImage from "../../images/back.jpg";
import {loginImage} from "./loginImage";

const CrearAlbum = () => {
    const url2 = `${process.env.REACT_APP_API_URL}api=cancion&id=sinalbum`;
    const [albumName, setAlbumName] = useState('');
    const [cancionesSinAlbum, setCancionesSinAlbum] = useState([]);
    const [selectedSong, setSelectedSong] = useState('');
    const [albumSongs, setAlbumSongs] = useState([]);
    const [albumImage, setAlbumImage] = useState(loginImage);
    const [previewImage, setPreviewImage] = useState('');
    const [cancionNueva, setCancionNueva] = useState([]);
    const [idUser, setIdUser] = useState('');

    const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };

    const verificarRol = (token) => {
        const Tipo = jwt_decode(token);
        const expiracion = Tipo.exp;
        console.log(Tipo);
        setIdUser(Tipo.id);
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
        const fetchData2 = async () => {
            const response = await axios.get(url2);
            setCancionesSinAlbum(response.data);
        };

        const fetchData = async () => {
            const token = sessionStorage.getItem('token');
            if (token !== null) {
                verificarRol(token);
                await fetchData2(); // Llamada a fetchData2 después de verificarRol
            } else {
                window.location.href = '/login';
                return;
            }
        };

        fetchData();
    }, []);


    const handleAddSong = () => {
        if (!selectedSong) {
            return;
        }

        setAlbumSongs([...albumSongs, cancionNueva]);
        setSelectedSong('');
        setCancionesSinAlbum(cancionesSinAlbum.filter((song) => song.idCANCION !== cancionNueva.idCANCION));
    };

    const handleRemoveSong = (song) => {
        const updatedSongs = albumSongs.filter((s) => s !== song);
        setAlbumSongs(updatedSongs);
        setCancionesSinAlbum([...cancionesSinAlbum, song]);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = (e) => {
                const base64Image = (e.target.result);
                setAlbumImage(base64Image);
                setPreviewImage(base64Image);
            };
            reader.readAsDataURL(file);
        }
    };

      
      

    const handleSaveChanges = () => {
        // Aquí puedes guardar los cambios en tu aplicación
        // por ejemplo, hacer una llamada a una API o actualizar el estado global
        //console.log('idUser: ', idUser);
        //console.log('Nombre del álbum:', albumName);
        //console.log('Canciones del álbum:', albumSongs);
        //console.log('Imagen del álbum:', albumImage);

        const fetchdata = async () => {
            try {
              const requestBody = {
                nom: albumName,
                linkimg: albumImage,
                arrayCanciones: albumSongs,
                idUser: idUser
              };
              const response = await axios.post(`${process.env.REACT_APP_API_URL}api=album&id=crear`, requestBody);
              console.log('response: ', response);
              if (response.status === 200) {
                toast.success('Álbum creado exitosamente', {
                  position: toast.POSITION.TOP_CENTER,
                  autoClose: 2000,
                });
                await sleep(2000);
                window.location.href = '/usuario';
              } else {
                toast.error('Error al crear el álbum', {
                  position: toast.POSITION.TOP_CENTER,
                  autoClose: 2000,
                });
              }
            } catch (error) {
              console.error('Error en la solicitud:', error);
              toast.error('Album ya existe, verifique sus datos', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
              });
            }
          };
        if (albumName === ''  ) {
            toast.error('Debe llenar todos los campos', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
            return;
        }else{
            fetchdata();
        }
        
    };

    return (
        <div className="cgeneral" style={{
            backgroundImage: `url(${backgroundImage})`
        }}>
             <ToastContainer />
            <BarraUsuario className="barra-usuario" />
            <div className="album-form">
                <h5 style={{ color: 'white' }}>Nombre Album</h5>
                <TextField
                    label="Nombre del álbum"
                    color="success"
                    name="nombrealbumgood"
                    focused
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                    fullWidth
                    inputProps={{
                        style: { color: '#fff' },
                    }}
                    sx={{ marginBottom: '1rem' }}
                />
                <FormControl color="success" fullWidth>
                    <h5 style={{ color: 'white' }}>Agregar Canciones</h5>
                    <InputLabel id="ddemo-simple-select-label">Seleccionar Canción</InputLabel>
                    <Select
                        labelId="ddemo-simple-select-label"
                        label="Seleccionar Canción"
                        value={selectedSong}
                        onChange={(e) => {
                            setSelectedSong(e.target.value);
                            const cancion = cancionesSinAlbum.find((song) => song.idCANCION === e.target.value);
                            setCancionNueva(cancion);
                        }}

                        fullWidth
                        style={{ width: '100%', marginBottom: '16px', backgroundColor: '#fff' }}
                        sx={{ marginBottom: '1rem' }}
                    >
                        <MenuItem value="" disabled>
                            Seleccionar canción
                        </MenuItem>
                        {cancionesSinAlbum.map((song) => (
                            <MenuItem key={song.idCANCION} value={song.idCANCION}>
                                {song.nombre_cancion}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button variant="contained" onClick={handleAddSong} sx={{ marginBottom: '1rem' }}>
                        Agregar canción
                    </Button>
                </FormControl>
                <h5 style={{ color: 'white' }}>Lista de canciones en album</h5>
                <TableContainer component={Paper} sx={{ marginBottom: '1rem' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Canción</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {albumSongs.map((song) => (
                                <TableRow key={song.idCANCION}>
                                    <TableCell>{song.nombre_cancion}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleRemoveSong(song)} color="error">
                                            Eliminar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <input
                    accept="image/*"
                    id="album-image"
                    type="file"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                />
                <input
                    accept="image/*"
                    id="album-image"
                    type="file"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                />
                <div className="image-container">
                    {previewImage && (
                        <Card>
                            <CardMedia
                                component="img"
                                image={previewImage}
                                alt="Preview"
                                style={{ maxWidth: '100%', marginBottom: '1rem' }}
                            />
                        </Card>
                    )}
                </div>
                <label htmlFor="album-image">
                    <Button variant="contained" component="span" sx={{ marginBottom: '1rem' }}
                    name="crearalbumgood">
                        Cargar imagen del álbum
                    </Button>
                </label>
                <Button variant="contained" onClick={handleSaveChanges} className="save-changes-button" name="Guardarcambiosalbum">
                    Guardar cambios
                </Button>
            </div>
        </div>
    );
};

export default CrearAlbum;
