import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Grid from "@mui/material/Unstable_Grid2/Grid2";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import Skeleton from "@mui/material/Skeleton";

import SectionPage from "../../components/section_page/SectionPage";

import ContextConnected from "../../context/ContextConnected";

import "./LocatePage.css";

function LocatePageStep2() {
    const Connected = useContext(ContextConnected);
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);

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
                const res = await fetch(
                    `${Connected.currentURL}api/v1/deposito/partidas/?numero=${location.state.pallet}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token.access_token}`,
                        },
                    },
                );
                const data = await res.json();
                data.status ===
                    "El Pallet ingresado se encuentra en una ubicacion" &&
                    navigate(-1);
                setPallet(data.data[0]);
                setWeight(data.data[0].n_tipopeso);
                setHeight(data.data[0].n_tipoaltura);
                setRotation(data.data[0].n_nivelrotacion);
                setLoading(false);
            }
        };
        getPallet();
    }, [Connected, location, navigate]);

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

            await fetch(
                `${Connected.currentURL}api/v1/deposito/partidas/${pallet.n_id_partida}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token.access_token}`,
                    },
                    body: formdata,
                },
            );
        }
    };

    return (
        <>
            <SectionPage sectionHeader="Ubicar">
                <CardContent>
                    {loading ? (
                        <>
                            <Skeleton
                                variant="text"
                                width="50%"
                                sx={{ fontSize: "20px" }}
                                animation="wave"
                            />
                            <Skeleton>
                                <hr className="separator" />
                            </Skeleton>
                        </>
                    ) : (
                        <>
                            <Typography
                                variant="h4"
                                className="add-page-card-header"
                            >
                                {pallet.c_tipo_contenido}
                                {pallet.c_numero} <span>/ Detalles</span>
                            </Typography>
                            <hr className="separator" />
                        </>
                    )}

                    <Grid container spacing={2}>
                        <Grid xs={6} sm={6} md={12} lg={12}>
                            {loading ? (
                                <>
                                    <Skeleton
                                        variant="text"
                                        width="30%"
                                        animation="wave"
                                        sx={{ fontSize: "16px" }}
                                        style={{ marginBottom: "10px" }}
                                    />
                                    <Skeleton
                                        variant="rounded"
                                        width="100%"
                                        height={40}
                                        animation="wave"
                                    />
                                </>
                            ) : (
                                <>
                                    <Typography variant="h5" className="label">
                                        Peso
                                    </Typography>
                                    <FormControl variant="outlined" fullWidth>
                                        <Select
                                            id="pallet-weight"
                                            value={weight}
                                            size="small"
                                            onChange={handleWeight}
                                            className="add-page-input"
                                        >
                                            <MenuItem value={1}>
                                                1 - Pesado
                                            </MenuItem>
                                            <MenuItem value={2}>
                                                2 - Intermedio
                                            </MenuItem>
                                            <MenuItem value={3}>
                                                3 - Liviano
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </>
                            )}
                        </Grid>

                        <Grid xs={6} sm={6} md={12} lg={12}>
                            {loading ? (
                                <>
                                    <Skeleton
                                        variant="text"
                                        width="30%"
                                        animation="wave"
                                        sx={{ fontSize: "16px" }}
                                        style={{ marginBottom: "10px" }}
                                    />
                                    <Skeleton
                                        variant="rounded"
                                        width="100%"
                                        height={40}
                                        animation="wave"
                                    />
                                </>
                            ) : (
                                <>
                                    <Typography variant="h5" className="label">
                                        Altura
                                    </Typography>
                                    <FormControl variant="outlined" fullWidth>
                                        <Select
                                            id="pallet-height"
                                            value={height}
                                            size="small"
                                            onChange={handleHeight}
                                            className="add-page-input"
                                        >
                                            <MenuItem value={1}>
                                                1 - Bajo
                                            </MenuItem>
                                            <MenuItem value={2}>
                                                2 - Alto
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </>
                            )}
                        </Grid>

                        <Grid xs={12} sm={12} md={12} lg={12}>
                            {loading ? (
                                <>
                                    <Skeleton
                                        variant="text"
                                        width="30%"
                                        animation="wave"
                                        sx={{ fontSize: "16px" }}
                                        style={{ marginBottom: "10px" }}
                                    />
                                    <Skeleton
                                        variant="rounded"
                                        width="100%"
                                        height={40}
                                        animation="wave"
                                    />
                                </>
                            ) : (
                                <>
                                    <Typography variant="h5" className="label">
                                        Nivel de Rotación
                                    </Typography>
                                    <FormControl variant="outlined" fullWidth>
                                        <Select
                                            id="pallet-rotation"
                                            value={rotation}
                                            size="small"
                                            onChange={handleRotation}
                                            className="add-page-input"
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={2}>2</MenuItem>
                                            <MenuItem value={3}>3</MenuItem>
                                        </Select>
                                    </FormControl>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Button
                        variant="contained"
                        size="medium"
                        disabled={loading}
                        disableElevation
                        className="add-page-button"
                        onClick={(e) => {
                            changePallet(e);
                            navigate("ubicacion", {
                                state: {
                                    pallet: pallet,
                                    url: location.state.url,
                                },
                            });
                        }}
                    >
                        Siguiente
                    </Button>
                </CardActions>
            </SectionPage>
        </>
    );
}

export default LocatePageStep2;
