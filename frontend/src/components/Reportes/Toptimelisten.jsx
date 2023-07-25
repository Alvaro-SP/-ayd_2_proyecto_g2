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
    { id: 'column2', label: 'Nombre (user)', align: 'left', minWidth: 100 },
    { id: 'column3', label: 'NickName', align: 'left', minWidth: 100 },
    { id: 'column4', label: 'Tiempo de Reproducccion', align: 'left', minWidth: 100 },
];

export function Toptimelisten() {

    const [name, setName] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [rows, setRows] = useState([
        { code: 'xs', column1: '1', column2: 'Alberto Gonzales', column3: 'Alberto', column4: '10 horas 30 minutos' },
        { code: 'sm', column1: '2', column2: 'Juan Perez', column3: 'Juan', column4: '9 horas 30 minutos' },
        { code: 'md', column1: '3', column2: 'Maria Lopez', column3: 'Maria', column4: '50 horas 30 minutos' },
        { code: 'lg', column1: '4', column2: 'Pedro Rodriguez', column3: 'Pedro', column4: '25 horas 45 minutos' },
        { code: 'xl', column1: '5', column2: 'Jose Hernandez', column3: 'Jose', column4: '15 horas 30 minutos' },
        { code: 'xr', column1: '6', column2: 'Alberto Gonzales', column3: 'Alberto', column4: '10 horas 30 minutos' },
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

    const getPerfil = async () => {
        const data = {
            token: sessionStorage.getItem("token")
        }

        try {
            console.log(data)
            const result = (await axios.post(`${process.env.REACT_APP_API_URL}api=admin&id=toptimelisten`, data, auth)).data
            console.log("RESULT", result)

            if (result) {
                const newJSON = result.map((item) => ({
                    code: item.id.toString(),
                    column1: '',
                    column2: item.nombre,
                    column3: item.nickname,
                    column4: item.tiempo_reproduccion,
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
                            <Typography variant="h4" color="black" align="center">
                            TOP USUARIOS CON MAS REPRODUCCIONES
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