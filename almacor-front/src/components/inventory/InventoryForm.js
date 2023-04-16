import React, { useState, useEffect, useContext, useRef } from 'react';

import Grid from '@mui/material/Unstable_Grid2/Grid2';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { PalletMask } from '../masked-inputs/PalletMask';
import { LocationMask } from '../masked-inputs/LocationMask';

import ContextConnected from '../../context/ContextConnected';

const UseFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}

	return [ htmlElRef,  setFocus ] 
}

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function InventoryForm(props) {

    const Connected = useContext(ContextConnected);

    const [inputPalletFocus, setInputPalletFocus] = UseFocus();
    const [inputLocationFocus, setInputLocationFocus] = UseFocus();

    useEffect(() => {
        setInputPalletFocus();
    },[])

    const [errorPallet, setErrorPallet] = useState(false);
    const [validPallet, setValidPallet] = useState(false);
    const [validPalletLength, setValidPalletLength] = useState(false);

    const [pallet, setPallet] = useState("");

    const handleChangePallet = (e) => {
        setPallet(e.target.value);
        
        if (e.target.value.substr(0,2) === "PL") {
            setValidPallet(true);
            if (e.target.value.length > 9) {
                setValidPalletLength(true);
                setErrorPallet(false);
                if (e.target.value.length === 10) {
                    setPallet(e.target.value);
                    setInputLocationFocus();
                } else {
                    return null;
                }
            } else {
                setValidPalletLength(false);
                setErrorPallet(true);
            }
        } else {
            setValidPallet(false);
            setErrorPallet(true);
        };
    };

    const [errorLocation, setErrorLocation] = useState(false);
    const [validLocation, setValidLocation] = useState(false);
    const [validLocationLength, setValidLocationLength] = useState(false);

    const [location, setLocation] = useState("");
    
    const handleChangeLocation = (e) => {
        setLocation(e.target.value);
        
        if (e.target.value.substr(0,2) === "UB") {
            setValidLocation(true);
            if (e.target.value.length > 11) {
                setValidLocationLength(true);
                setErrorLocation(false);
                if (e.target.value.length === 12) {
                    addIncidence(e.target.value)
                } else {
                    return null;
                }
            } else {
                setValidLocationLength(false);
                setErrorLocation(true);
            };
        } else {
            setValidLocation(false);
            setErrorLocation(true);
        };
    };

    const addIncidence = async (loc) => {

        const token = await JSON.parse(localStorage.getItem("token"));
        if (token) {

            const n_id_empresa = Connected.userInfo.n_id_empresa;
            const n_id_inventario = props.inventoryId;
            const ubicacion = loc;
            const numero = pallet;

            var formdata = new FormData();
            formdata.append("n_id_empresa", n_id_empresa);
            formdata.append("n_id_inventario", n_id_inventario);
            formdata.append("ubicacion", ubicacion);
            formdata.append("numero", numero);

            const response = await fetch(`${Connected.currentURL}api/v1/deposito/inventarios_reales/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token.access_token}`
                },
                body: formdata
            })
            const data = await response.json();
            if (data.error) {

                if (data.error[0] === "Esta ubicacion ya se encuentra registrada en este inventario") {
                    handleOpenAlert("Esta ubicación ya está en uso", "error")
                } else if (data.error[0] === "Esta partida ya se encuentra registrada en este inventario") {
                    handleOpenAlert("Este pallet ya está almacenado", "error")
                } else if (data.error[0] === "El Pallet ingresado no existe") {
                    handleOpenAlert("Este pallet no existe", "error")
                }

            } else if (data.status) {

                if (data.status[0] === "Esta posicion no existe") {
                    handleOpenAlert("Esta ubicación no existe", "error")
                }
                else if (data.info) {
                    props.setRefresh(true);
                    setPallet("");
                    setLocation("");
                    setInputPalletFocus();
                    handleOpenAlert("Almacenado correctamente");
                }
                
            }
            console.log(data);

        }
    };

    const [openAlert, setOpenAlert] = useState(false);
    const [alertType, setAlertType] = useState("")
    const [alert, setAlert] = useState("");
    const state = {
        vertical: 'top',
        horizontal: 'center',
    };
    const { vertical, horizontal } = state;

    const handleOpenAlert = (alert, type) => {
        setAlertType(type);
        setAlert(alert);
        setOpenAlert(true);
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    return(
        <>
            <Grid container spacing={2}>
                <Grid xs={12} sm={12} md={12} lg={12}>

                    <FormControl error={pallet === "" ? false : errorPallet} size="small" margin="dense" fullWidth>
                        <InputLabel>Pallet</InputLabel>
                        <OutlinedInput
                            id="pallet-code"
                            label="Pallet"
                            value={pallet}
                            onChange={handleChangePallet}
                            inputComponent={PalletMask}
                            inputRef={inputPalletFocus}
                        />
                        <FormHelperText>
                            {
                                pallet === "" ?
                                    "" 
                                : errorPallet ? 
                                    !validPallet ? 
                                        "El código no es valido" 
                                    : !validPalletLength ? 
                                        "El código es demasiado corto" 
                                    : "" 
                                : ""
                            }
                        </FormHelperText>
                    </FormControl>

                </Grid>

                <Grid xs={12} sm={12} md={12} lg={12}>
                    <FormControl error={location === "" ? false : errorLocation} size="small" fullWidth>
                        <InputLabel>Ubicación</InputLabel>
                        <OutlinedInput
                            id="pallet-code"
                            label="Ubicación"
                            value={location}
                            onChange={handleChangeLocation}
                            inputComponent={LocationMask}
                            inputRef={inputLocationFocus}
                        />
                        <FormHelperText>
                            {
                                location === "" ?
                                    "" 
                                : errorLocation ? 
                                    !validLocation ? 
                                        "El código no es valido" 
                                    : !validLocationLength ? 
                                        "El código es demasiado corto" 
                                    : "" 
                                : ""
                            }
                        </FormHelperText>
                    </FormControl>
                </Grid>
            </Grid>

            <Snackbar 
                open={openAlert}
                autoHideDuration={2200}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical, horizontal }}
            >
                <Alert 
                    onClose={handleCloseAlert} 
                    severity={alertType} 
                    sx={{ width: '100%' }}
                >
                    {alert}
                </Alert>
            </Snackbar>
        </>
    );
}

export default InventoryForm;