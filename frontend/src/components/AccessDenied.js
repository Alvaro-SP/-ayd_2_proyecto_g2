import { Container, Grid } from "@mui/material";
import React from "react";
import AlbumIcon from '@mui/icons-material/Album';

export class AccessDenied extends React.Component {

    IrInicio = (e) => {
        window.location.href = "/login"
    }

    render() {
        return (
            // faf056 F8EB25
            // 085394
            <div>
                <nav class="navbar navbar-expand-lg" style={{ backgroundColor: '#223263' }}>
                    <div class="container-fluid">
                        <a class="navbar-brand" href="" style={{ color: '#f8eb25' }}><AlbumIcon style={{ color: "#f8eb25" }} /> AyDisco</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                    </div>
                </nav>
                <Grid display="flex" justifyContent="center" alignItems="center" style={{ padding: '5%' }}>
                    <Container style={{ background: '#085394', width: '45%', height: '60%' }}>
                        <br>
                        </br>
                        <div class="text-center">
                            <h2 class="text-center" style={{ color: 'white' }}>Error 404</h2><br></br>
                            <h3 class="text-center" style={{ color: 'white' }}>No cumples las validaciones necesarias!</h3><br></br>
                            <button class="btn" style={{ color: '#f8eb25', border: '2px solid #f8eb25' }} type="submit" onClick={this.IrInicio}>Volver a Inicio</button>

                        </div>
                        <br></br>
                    </Container>

                </Grid>
            </div>
        )
    }

}