import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Delete } from '@mui/icons-material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import VisibilityIcon from '@mui/icons-material/PersonAddDisabled';
import axios from "axios"
import avatar from '../../images/avatar.png'
import '../../styles/AlbumComponent.css';

const UserComponent = ({ userName,id, onEditAlbum, onunfollow ,showfollowbutton, showViewButton}) => {
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

  const handleEdit2 = () => {
    console.log("idAlbum a editar: ", id);
    try{
      onunfollow(id);
    }
    catch(error){
      console.log(error);
    }
  };

  // const handleConfirmDelete = () => {
  //   // Lógica para eliminar el álbum
  //   setOpenDeleteDialog(false);
  //   console.log("idAlbum a eliminar: ", id);
  //   try{
  //     axios.post("http://localhost:3010?api=album&id=eliminar", {
  //       idAlbum: id
  //     })
  //     .then((response) => {
  //       console.log("esto es response: ", response);
  //      // onDeleteAlbum(id);
  //     })
  //   }
  //   catch(error){
  //     console.log(error);
  //   }

  // };

  const handleView = () => {
    localStorage.setItem('asl', id );
    window.location.href = "/albumsuserfollow";

  };

  const handleUnfollow = () => {
    localStorage.setItem('asl', id );
    window.location.href = "/unfollow";
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Card
      className={`album-componentt ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a href="/login">
      <div className="card-media-containerr">
          <div className="album-image-wrapper">
            {avatar ? (
              <CardMedia
                component="img"
                image={avatar}
                alt="avatar usuario"
              />
          ) : (
            <div className="no-image-placeholder">
              <Typography variant="body1">No hay imagen</Typography>
            </div>
          )}
        </div>
      </div>
      </a>
      <CardContent className="album-info">
        <Typography variant="subtitle1" align="center">
          {userName}
        </Typography>
        <div className={`button-container ${isHovered ? 'visible' : ''}`}>
          { showfollowbutton && (
            <Button
            variant="contained"
            style={{ borderRadius: '30%', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '0.5px outset blue' }}
            onClick={handleEdit}
          >
            <PersonAddAltIcon style={{ color: '#4B4B4A' }} />
          </Button>
          )
          }
          { showViewButton && (
            <Button
            variant="contained"
            style={{ borderRadius: '30%', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '0.5px outset blue' }}
            onClick={handleView}
          >
            <VisibilityIcon style={{ color: '#4B4B4A' }} />
          </Button>
          )
          }
          
          {/* <Button
            variant="contained"
            style={{ borderRadius: '30%', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '0.5px outset red' }}
            onClick={handleDelete}
          >
            <Delete style={{ color: '#4B4B4A' }} />
          </Button> */}
        </div>
        <div className={`button-container ${isHovered ? 'visible' : ''}`}>
        { showfollowbutton && (
            <Button
            variant="contained"
            style={{ borderRadius: '30%', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '0.5px outset blue' }}
            onClick={handleEdit}
          >
            <PersonAddAltIcon style={{ color: '#4B4B4A' }} />
          </Button>
          )
          }
          { showViewButton && (
            <Button
            variant="contained"
            style={{ borderRadius: '30%', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '0.5px outset blue' }}
            onClick={handleEdit2}
          >
            <VisibilityIcon style={{ color: '#4B4B4A' }} />
          </Button>
          )
          }
        </div>
      </CardContent>
      {/*<Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">¿Estás seguro de que deseas eliminar este álbum?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancelar</Button>
           <Button onClick={handleConfirmDelete} color="error">
            Eliminar
          </Button> 
        </DialogActions>
      </Dialog>*/}
    </Card>
  );
};

export default UserComponent;
