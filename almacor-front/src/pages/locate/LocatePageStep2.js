import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import ContextConnected from '../../context/ContextConnected';

import "./LocatePage.css";

function LocatePageStep2() {

    const Connected = useContext(ContextConnected);
    const navigate = useNavigate();
    const location = useLocation();

    const [pallet, setPallet] = useState([]);

    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [rotation, setRotation] = useState("");

    const handleWeight = (event) => {
        setWeight(event.target.value);
    };

    const handleHeight = (event) => {
        setHeight(event.target.value);
    };

    const handleRotation = (event) => {
        setRotation(event.target.value);
    };

    useEffect(() => {
        const getPallet = async () => {
          const token = await JSON.parse(localStorage.getItem("token"));
          if (token) {
            const res = await fetch(`${Connected.currentURL}api/v1/deposito/partidas/?numero=${location.state}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.access_token}`
              },
            });
            const data = await res.json();
            setPallet(data.data[0]);
            setWeight(data.data[0].n_tipopeso);
            setHeight(data.data[0].n_tipoaltura);
            setRotation(data.data[0].n_nivelrotacion);
            console.log(data);
          }
        };
        getPallet();
    }, []);

    const changePallet = async (e) => {
        e.preventDefault();

        const token = await JSON.parse(localStorage.getItem("token"));
        if (token) {

            const n_tipopeso = weight;
            const n_tipoaltura = height;
            const n_nivelrotacion = rotation;

            var formdata = new FormData();
            formdata.append("n_tipopeso", n_tipopeso);
            formdata.append("n_tipoaltura", n_tipoaltura);
            formdata.append("n_nivelrotacion", n_nivelrotacion);

            await fetch(`${Connected.currentURL}api/v1/deposito/partidas/${pallet.n_id_partida}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token.access_token}`
                },
                body: formdata
            })

        }
    };

    useEffect(() => {
        const keyDownHandler = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();

                changePallet(e);
                navigate("ubicacion", {state: pallet});
            }
        };
    
        document.addEventListener('keydown', keyDownHandler);
    
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [pallet]);


    return (
        <>
            <div className='add-page-header'>

                <Typography variant='h3' className='orders-header'>Ubicar Pallet</Typography>

            </div>

            <Card variant="outlined" className='add-page-card'>
                <CardContent>
                    
                    <Typography variant='h4' className='add-page-card-header'>{pallet.c_tipo_contenido}{pallet.c_numero} <span>/ Detalles</span></Typography>
                    <hr className='separator' />

                    <div className='add-page-inputs-cont'>

                        <div className='add-page-input-label-cont'>

                            <Typography variant='h5' className='label'>Peso</Typography>
                            <Typography variant='h5' className='detail'>Se puede cambiar</Typography>

                        </div>
                    
                        <FormControl variant="outlined">
                            <Select
                                id="pallet-weight"
                                value={weight}
                                size="small"
                                onChange={handleWeight}
                                className='add-page-input'
                            >
                                <MenuItem value={1}>1 - Pesado</MenuItem>
                                <MenuItem value={2}>2 - Intermedio</MenuItem>
                                <MenuItem value={3}>3 - Liviano</MenuItem>
                            </Select>
                        </FormControl>

                        <div className='add-page-input-label-cont'>

                            <Typography variant='h5' className='label'>Altura</Typography>
                            <Typography variant='h5' className='detail'>Se puede cambiar</Typography>

                        </div>

                        <FormControl variant="outlined">
                            <Select
                                id="pallet-height"
                                value={height}
                                size="small"
                                onChange={handleHeight}
                                className='add-page-input'
                            >
                                <MenuItem value={1}>1 - Bajo</MenuItem>
                                <MenuItem value={2}>2 - Alto</MenuItem>
                            </Select>
                        </FormControl>

                        <div className='add-page-input-label-cont'>

                            <Typography variant='h5' className='label'>Nivel de rotación</Typography>
                            <Typography variant='h5' className='detail'>Se puede cambiar</Typography>

                        </div>

                        <FormControl variant="outlined">
                            <Select
                                id="pallet-rotation"
                                value={rotation}
                                size="small"
                                onChange={handleRotation}
                                className='add-page-input'
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                            </Select>
                        </FormControl>

                    </div>
                </CardContent>
                <CardActions>

                    <Button
                        variant="contained"
                        size="medium"
                        className='add-page-button'
                        disableElevation
                        onClick={(e) => {
                            changePallet(e);
                            navigate("ubicacion", {state: pallet});
                        }}
                    >
                        Siguiente
                    </Button>
                    
                </CardActions>
            </Card>
        </>
    );
}

export default LocatePageStep2;