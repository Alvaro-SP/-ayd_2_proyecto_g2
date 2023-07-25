import { useEffect, useState } from "react";
import { url } from "../../shared/url";
import { auth } from "../../shared/auth";
import axios from "axios";
import "../../styles/reportes/topsongs.css";
import { AES } from 'crypto-js';
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Typography } from '@mui/material';
// import "materialize-css";
// import "materialize-css/dist/css/materialize.min.css";
import { Grid, TextField, Button } from '@mui/material';
import { Person, Markunread, Smartphone, Map, Badge } from '@mui/icons-material';
import { ChangeCircle } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { VisibilityOff } from '@mui/icons-material';
import CryptoJS from 'crypto-js';
const columns = [
    { id: 'column1', label: 'Rank', align: 'left', minWidth: 100 },
    { id: 'column2', label: 'Nombre (song title)', align: 'left', minWidth: 100 },
    { id: 'column3', label: 'Fecha de Subida', align: 'left', minWidth: 100 },
    { id: 'column4', label: 'Reproducciones', align: 'left', minWidth: 100 },
    { id: 'column5', label: 'Extension', align: 'left', minWidth: 100 },
    // Agrega más columnas si es necesario
  ];
export function Topsongs() {

    const [name, setName] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [rows, setRows] = useState([
        { code: '1', column1: '1', column2: 'As the worlds turns', column3: '2021-10-10', column4: '1000000', column5: 'mp3' },
        { code: '2', column1: '2', column2: 'Without Me', column3: '2001-10-10', column4: '1258941', column5: 'mp3' },
        { code: '3', column1: '3', column2: 'The Real Slim Shady', column3: '2001-10-10', column4: '1258941', column5: 'mp3' },
        { code: '4', column1: '4', column2: 'Lose Yourself', column3: '2001-10-10', column4: '1258941', column5: 'mp3' },
        { code: '5', column1: '5', column2: 'Stan', column3: '2001-10-10', column4: '1258941', column5: 'mp3' },
        { code: '6', column1: '6', column2: 'Rap God', column3: '2001-10-10', column4: '1258941', column5: 'mp3' },
        // Agrega más filas si es necesario
      ]);

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatValue = (value) => {
        // Agrega lógica de formato personalizada si es necesario
        return value;
    };

    useEffect(() => {
        getPerfil()
    }, []);
    function fechaformateada(fecha) {
        var d = new Date(fecha),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = '' + d.getFullYear(),
            hour = '' + d.getHours(),
            minute = '' + d.getMinutes(),
            second = '' + d.getSeconds();
            return [day, month, year].join('-') + " a las " + [hour, minute, second].join(':')+ " hrs";
    }
    const getPerfil = async () => {
        const data = {
            token: sessionStorage.getItem("token")
        }

        try {
            console.log(data)
            const result = (await axios.post(`${process.env.REACT_APP_API_URL}api=admin&id=topsongs`, data, auth)).data
            console.log("RESULT", result)

            if (result) {

                const newJSON = result.map((item) => ({
                    code: item.idCANCION.toString(),
                    column1: '',
                    column2: item.nombre_cancion,
                    column3: fechaformateada(item.fecha),
                    column4: item.no_reproducciones,
                    column5: item.extension,
                }));
                newJSON.forEach((item, index) => {
                    item.column1 = (index + 1).toString();
                });
                console.log("NEW JSON", newJSON)
                setRows(newJSON);
                toast.success(result.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            } else {
                toast.error(result.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                });
            }
        } catch (error) {
            console.log(error)
            toast.error("Su sesion ha expirado!, codigo: "+error.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }

    return (
        <>
            <section>
                <div className="containerTopSongs">
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h3" color="black" align="center">
                            TOP CANCIONES MAS REPRODUCIDAS
                            </Typography>
                            <hr />
                        </Grid>
                        
                    </Grid>
                    <div className="tablareporte">
                        <table aria-label="sticky table">
                            <thead>
                            <tr>
                                {columns.map((column) => (
                                <th key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                    {column.label}
                                </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                <tr key={row.code}>
                                    {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                        <td key={column.id} align={column.align}>
                                        {column.format && typeof value === 'number' ? formatValue(value) : value}
                                        </td>
                                    );
                                    })}
                                </tr>
                                ))}
                            </tbody>
                        </table>
                        <div>
                            <select value={rowsPerPage} onChange={handleChangeRowsPerPage}>
                            {[6, 12, 18].map((option) => (
                                <option key={option} value={option}>
                                {option}
                                </option>
                            ))}
                            </select>
                            <span>Page {page + 1}</span>
                            <button disabled={page === 0} onClick={() => handleChangePage(page - 1)}>
                            Previous Page
                            </button>
                            <button
                            disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}
                            onClick={() => handleChangePage(page + 1)}
                            >
                            Next Page
                            </button>
                        </div>
                    </div>
                    <br />
                    <br />
                </div>
            </section>
        </>
    );
}