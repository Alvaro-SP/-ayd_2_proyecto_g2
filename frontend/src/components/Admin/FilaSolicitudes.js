import React from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

export function FilaSolicitudes({ solicitud, index,refrescar }) {
    const { id, nombre, nickname, nacimiento } = solicitud
    const i = index + 1


    const aceptar = () => {
        axios.patch(`${process.env.REACT_APP_API_URL}api=admin&id=aceptar`, { id: id })
            .then(response => {
                console.log(response)
                toast.success("Solicitud aceptada con exito", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                refrescar()

            })
            .catch(error => {
                console.log(error)
                toast.warning("Solicitud fallida", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            })
    }
    const rechazar = () => {
        axios.patch(`${process.env.REACT_APP_API_URL}api=admin&id=rechazar`, { id: id })
            .then(response => {
                console.log(response)
                toast.success("Solicitud rechazada con exito", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
                refrescar()

            })
            .catch(error => {
                console.log(error)
                toast.warning("Solicitud fallida", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000,
                });
            })
    }

    return (
        <>
        <tr key={id} class="table-light">
            <th scope="row" class="text-center">{i}</th>
            <td class="text-center">{nombre}</td>
            <td class="text-center">{nickname}</td>
            <td class="text-center">{nacimiento}</td>
            <td class="text-center">
                <button type="button" class="btn btn-success" onClick={aceptar}>Aceptar</button>
            </td>
            <td class="text-center">
                <button type="button" class="btn btn-danger" onClick={rechazar}>Denegar</button>
            </td>           
        </tr> 
        </>
    )
}