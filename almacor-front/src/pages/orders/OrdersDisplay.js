import { useState, useEffect, useContext } from 'react';

import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';

import OrderButton from "../../components/orders/OrderButton";

import ContextConnected from '../../context/ContextConnected';

import "./OrdersDisplay.css"

function OrdersDisplay() {

    const Connected = useContext(ContextConnected);

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const getOrders = async () => {
          const token = await JSON.parse(localStorage.getItem("token"));
          if (token) {
            const res = await fetch(`${Connected.currentURL}api/v1/deposito/ordenpartidascb/`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.access_token}`
              },
            })
            const data = await res.json();
            setOrders(data);
            console.log(data);
          }
        };
        getOrders();
    }, []);

    return(

        <div className="orders">

            <Typography variant='h3' className='orders-header'>Ordenes de carga activas</Typography>

            <div className='orders-buttons'>

                <Grid container spacing={2}>

                    {
                        orders.map((order) => {

                            return (

                                <OrderButton
                                    key={order.n_id_pk}
                                    orderNumber={order.n_id_orden_de_carga}
                                    orderStore={order.c_descripcion}
                                    order={order}
                                />

                            );

                        })
                    }
                    
                </Grid>

            </div>


        </div>

    );
}

export default OrdersDisplay;