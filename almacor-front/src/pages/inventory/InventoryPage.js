import React, { useState, useEffect, useContext } from 'react';

import Grid from '@mui/material/Unstable_Grid2/Grid2';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import DisplayPage from '../../components/display/DisplayPage';
import DisplaySkeleton from '../../components/display/DisplaySkeleton';
import DisplayButton from '../../components/display/DisplayButton';

import ContextConnected from '../../context/ContextConnected';

function InventoryPage () {

    const Connected = useContext(ContextConnected);

    const [loading, setLoading] = useState(true);

    const [inventory, setInventory] = useState([]);
    const [currentCompany, setCurrentCompany] = useState("");
    const [inventoryType, setInventoryType] = useState("T");

    const handleCurrentCompany = (e) => {
        setCurrentCompany(e.target.value);
    };

    const handleInventoryType = (e) => {
        setInventoryType(e.target.value);
    };

    const [openDialog, setOpenDialog] = useState(false);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    useEffect(() => {
        const getOrders = async () => {
          const token = await JSON.parse(localStorage.getItem("token"));
          if (token) {
            const res = await fetch(`${Connected.currentURL}api/v1/deposito/inventarios/?empresa=${Connected.userInfo.n_id_empresa}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.access_token}`
              },
            })
            const data = await res.json();
            setInventory(data);
            setCurrentCompany(Connected.userInfo.n_id_empresa);
            setLoading(false);
            console.log(data);
          }
        };
        getOrders();
    }, [Connected]);

    const addInventory = async () => {

        const token = await JSON.parse(localStorage.getItem("token"));
        if (token) {

            const n_id_empresa = currentCompany;
            const c_tipo_inventario = inventoryType;

            var formdata = new FormData();
            formdata.append("n_id_empresa", n_id_empresa);
            formdata.append("c_tipo_inventario", c_tipo_inventario);

            const response = await fetch(`${Connected.currentURL}api/v1/deposito/inventarios/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token.access_token}`
                },
                body: formdata
            })
            const newData = await response.json();
            setInventory([...inventory, newData]);
            console.log(newData);

        }
    };

    return (
        <>
            <DisplayPage
                displayPageHeader="Inventarios"
                addButton
                setOpenDialog={setOpenDialog}
            >

                <Grid container spacing={2}>

                    {
                        loading ? (
                            <>
                                <DisplaySkeleton />
                                <DisplaySkeleton />
                                <DisplaySkeleton />
                                <DisplaySkeleton />
                            </>
                        ) : (

                            inventory.map((item) => {
                                return (

                                    <DisplayButton
                                        key={item.n_id_pk}
                                        displayButtonTypeDetail={item.c_tipo_inventario === "T" ? "Total" : "Parcial"}
                                        displayButtonHeader={`Inventario ${item.n_id_inventario}`}
                                        displayButtonURL={`inventario=${item.n_id_inventario}`}
                                        object={item}
                                    />

                                );
                            })

                        )
                    }

                </Grid>

            </DisplayPage>

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">

                <DialogTitle>Añadir Inventario</DialogTitle>

                <DialogContent>
                    <div className='add-page-inputs-cont'>

                        <div className='add-page-input-label-cont'>

                            <Typography variant='h5' className='label'>Empresa</Typography>

                        </div>

                        <FormControl variant="outlined" fullWidth>
                            <Select
                                id="pallet-weight"
                                value={currentCompany}
                                size="small"
                                disabled
                                onChange={handleCurrentCompany}
                                className='inventory-form-input'
                            >
                                <MenuItem value={currentCompany}>{currentCompany}</MenuItem>
                            </Select>
                        </FormControl>

                        <div className='add-page-input-label-cont'>

                            <Typography variant='h5' className='label'>Tipo</Typography>
                            <Typography variant='h5' className='detail'>Se puede cambiar</Typography>

                        </div>
                    
                        <FormControl variant="outlined" fullWidth>
                            <Select
                                id="pallet-weight"
                                value={inventoryType}
                                size="small"
                                onChange={handleInventoryType}
                                className='inventory-form-input'
                            >
                                <MenuItem value={"T"}>Total</MenuItem>
                                <MenuItem value={"P"}>Parcial</MenuItem>
                            </Select>
                        </FormControl>

                    </div>
                </DialogContent>

                <DialogActions>

                    <Button 
                        variant="outlined" 
                        className='add-page-button' 
                        onClick={() => {
                            addInventory();
                            handleCloseDialog();
                        }}
                    >
                        Aceptar
                    </Button>

                    <Button 
                        variant="contained" 
                        disableElevation
                        className='add-page-button' 
                        onClick={handleCloseDialog}
                    >
                        Cancelar
                    </Button>
                    
                </DialogActions>
            </Dialog>
        </>
    )
}

export default InventoryPage;