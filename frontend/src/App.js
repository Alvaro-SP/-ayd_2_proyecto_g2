import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Registro } from './components/Registro';
import { Login } from './components/Login';
import InicioUsuario from './components/InicioUsuario';
import { InicioAdmin } from './components/Admin/InicioAdmin';
import { AccessDenied } from './components/AccessDenied';
import Player from './components/Player';
import PlayerFooter from './components/PlayerFooter';
import EditarAlbum from './components/album/EditarAlbum';
import ReproductorAlbum from './components/RepAlbum';
import ReproductorCancion from './components/RepCancion';
import SharedCancion from './components/SharedCancion';
import SharedAlbum from './components/SharedAlbum';
import { SidebarUser } from './components/user_Profile/SidebarUser';
import { EditarPerfil } from './components/user_Profile/EditarPerfil';
import CrearAlbum from './components/album/CrearAlbum';
import { SidebarReport } from './components/Reportes/SidebarReport';
import ConsultAlbum from './components/consultaAlbum';
import SubirCancion from './components/subirCancion';
import { Buscar } from './components/Buscar/Buscar';
import FollowAlbumsUser from './components/Buscar/FollowAlbumsUser';

import { Usuarios } from './components/Admin/Usuarios';
import SharedConsultAlbum from './components/sharedConsultaAlbum';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/registro" Component={Registro}></Route>
        <Route path='/login' Component={Login}></Route>
        <Route path='/usuario' Component={InicioUsuario}></Route>
        <Route path='/admin' Component={InicioAdmin}></Route>
        <Route path='/repAlbum/:id' Component={ReproductorAlbum}></Route>
        <Route path='/repCancion/:id/:id_song' Component={ReproductorCancion}></Route>
        <Route path='/reproductorFooter' Component={PlayerFooter}></Route>
        <Route path='/sharedSong/:id_usr/:id/:id_song' Component={SharedCancion}></Route>
        <Route path='/sharedAlbum/:id_usr/:id' Component={SharedAlbum}></Route>
        <Route path='/accessDenied' Component={AccessDenied}></Route>
        <Route path='/editaralbum' Component={EditarAlbum}></Route>
        <Route path='/crearalbum' Component={CrearAlbum}></Route>

        <Route path="/profile" Component={SidebarUser}></Route>
        <Route path="/EditarPerfil" Component={EditarPerfil}></Route>

        <Route path="/admin/Reportes" Component={SidebarReport}></Route>
        <Route path="/buscar" Component={Buscar}></Route>
        <Route path="/consultaAlbum" Component={ConsultAlbum}></Route>
        <Route path="/sharedConsultaAlbum" Component={SharedConsultAlbum}></Route>
        <Route path="/reproductor" Component={Player}></Route>
        <Route path="/subirCancion" Component={SubirCancion}></Route>
        <Route path='/admin/usuarios' Component={Usuarios}></Route>

        <Route path="/albumsuserfollow" Component={FollowAlbumsUser}></Route>
        <Route path="*" Component={Login}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
