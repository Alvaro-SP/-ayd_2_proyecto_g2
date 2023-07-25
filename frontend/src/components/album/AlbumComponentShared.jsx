import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from "axios"
import '../../styles/AlbumComponent.css';

const AlbumComponentShared = ({ albumName, albumImage, id, onDisplayAlbum }) => {
  const [isHovered, setIsHovered] = useState(false);


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
          {/* aqui en vez del "#" pone la ruta que deseas por ejemplo: "/veralbum"*/}
          <a href='/sharedConsultaAlbum'>
          <Button
            variant="contained"
            style={{ borderRadius: '30%', backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '0.5px outset green' }}
            onClick={cambiar}
          >
            <VisibilityIcon style={{ color: '#4CAA51' }} />
          </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlbumComponentShared;
