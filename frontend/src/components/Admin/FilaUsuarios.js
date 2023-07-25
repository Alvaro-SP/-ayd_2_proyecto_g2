import React, { useState } from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function FilaUsuarios({ usuario, index, recargar }) {
    const { id, nombre, nickname, nacimiento } = usuario;
    const i = index + 1;
    let texto = "";

    const [modalId, setModalId] = useState(null);

    const onChange = (e) => {
        texto = e.target.value;
    };
   
    const reload = () => {
        window.location.href = "";
    };

    const dar_baja = () => {
        if (texto === "") {
            toast.warning("Debe de dar un motivo!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        } else {
            axios.patch(`${process.env.REACT_APP_API_URL}api=admin&id=dar_baja`, { id: id, mensaje: texto })
                .then(response => {
                    toast.success("Usuario dado de baja", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                        onClose: reload,
                    });
                })
                .catch(error => {
                    console.log(error);
                    toast.warning("Solicitud fallida", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                        onClose: reload,
                    });
                });
        }
    };

    const handleModalOpen = (id) => {
        setModalId(id);
    };

    const handleModalClose = () => {
        setModalId(null);
    };

    return (
        <>
        <tr key={id} className="table-light">
            <th scope="row">{i}</th>
            <td className="text-center">{nombre}</td>
            <td className="text-center">{nickname}</td>
            <td className="text-center">{nacimiento}</td>
            <td className="text-center">
                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                    <button type="button" className="btn btn-danger" onClick={() => handleModalOpen(id)}>
                        Dar de Baja
                    </button>
                    <div className={`modal fade${modalId === id ? ' show' : ''}`} id={`exampleModal-${id}`} tabIndex="-1" aria-labelledby={`exampleModalLabel-${id}`} aria-hidden="true" style={modalId === id ? { display: 'block' } : { display: 'none' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id={`exampleModalLabel-${id}`}>Dar de baja</h5>
                                    <button type="button" className="btn-close" onClick={handleModalClose} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor={`message-text-${id}`} className="col-form-label">Motivo</label>
                                            <textarea className="form-control" id={`message-text-${id}`} onChange={onChange}></textarea>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Close</button>
                                    <button type="button" className="btn btn-primary" onClick={dar_baja}>Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
        </>
    );
}