import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Edit, Delete} from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from "axios"
import '../../styles/AlbumComponent.css';

const AlbumComponent = ({ albumName, albumImage, id, onDeleteAlbum, onEditAlbum, onDisplayAlbum }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleEdit = () => {
    // Lógica para editar el álbum
    console.log("idAlbum a editar: ", id);
    try{
      onEditAlbum(id);
    }
    catch(error){
      console.log(error);
    }

  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    // Lógica para eliminar el álbum
    setOpenDeleteDialog(false);
    console.log("idAlbum a eliminar: ", id);
    try{
      axios.post(`${process.env.REACT_APP_API_URL}api=album&id=eliminar`, {
        idAlbum: id
      })
      .then((response) => {
        console.log("esto es response: ", response);
        onDeleteAlbum(id);
      })
    }
    catch(error){
      console.log(error);
    }

  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const cambiar = () => {
    console.log("idAlbum a visualizar: ",id);
    onDisplayAlbum(id);
  }

  return (
    <Card
      className={`album-componentt ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      <div className="card-media-containerr">
          <div className="album-image-wrapper">
            {albumImage ? (
              <CardMedia
                component="img"
                image={albumImage}
                alt={albumName}
              />
          ) : (
            <div className="no-image-placeholder">
              <Typography variant="body1">No hay imagen</Typography>
            </div>
          )}
        </div>
      </div>

      <CardContent className="album-infoo">
        <Typography variant="subtitle1" align="center">
          {albumName}
        </Typography>
        <div className={`button-container ${isHovered ? 'visible' : ''}`}>
          <a href='/editaralbum'>
          <Button
            variant="contained"
            style={{ borderRadius: '30%', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '0.5px outset blue' }}
            onClick={handleEdit}
          >
            <Edit style={{ color: '#4B4B4A' }} />
          </Button>
          </a>
          {/* aqui en vez del "#" pone la ruta que deseas por ejemplo: "/veralbum"*/}
          <a href='/consultaAlbum'>
          <Button
            variant="contained"
            style={{ borderRadius: '30%', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '0.5px outset green' }}
            onClick={cambiar}
          >
            <VisibilityIcon style={{ color: '#4CAA51' }} />
          </Button>
          </a>
          <Button
            variant="contained"
            name={albumName}
            style={{ borderRadius: '30%', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '0.5px outset red' }}
            onClick={handleDelete}
          >
            <Delete style={{ color: '#4B4B4A' }} />
          </Button>
        </div>
      </CardContent>
      <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">¿Estás seguro de que deseas eliminar este álbum?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} name='albumdel' color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default AlbumComponent;
