import React, { useState, useEffect } from 'react';
import { Typography, Button, TextField, Card, CardContent, CardActions, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import api from 'src/axiosInstance';

const Pedido = () => {
    const [open, setOpen] = useState(false);
    const [pedidos, setPedidos] = useState([]);
    const [foto, setFoto] = useState(null);
    const [estadope, setEstadope] = useState(null);
    const localData = window.localStorage.getItem('loggedFocusEvent');
    const localDataParsed = JSON.parse(localData);
    const userData = JSON.parse(localDataParsed.userData);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const handleOpen = (idpedido, estado) => {
        setOpen(true);
        // Aquí puedes almacenar el id del evento que se eliminará, ya sea en el estado o en una variable de referencia
        // Puedes usar la función setEventoAEliminar o useRef según tus necesidades
        setFoto(idpedido);
        setEstadope(estado);
    };
    const handleClose = () => {
        setOpen(false);
        // setFoto('');
        // setEstadope('');
    };
    const handleEstadoChange = (event) => {
        setEstadope(event.target.value);
    };
    const handleActualizar = async () => {
        try {
            await api.patch(`/carrito/${foto}`,
                {
                    "estado": estadope
                })
            setSnackbarMessage('Se actualizó el pedido');
            setSnackbarOpen(true);
            obtenerPedidos();
            setOpen(false);
        } catch (error) {
            setSnackbarMessage('Ocurrió un error inesperado');
            setSnackbarOpen(true);
        }
    }
    useEffect(() => {
        obtenerPedidos();
    }, []);

    const obtenerPedidos = async () => {
        try {
            const response = await api.get(`/carrito/pedidosVendedor/${userData.id}`);
            setPedidos(response.data);
        } catch (error) {
            console.log(`No tienes pedidos`)
        }
    }
    return (
        <PageContainer title="Tus ventas" description="Mira tus ventas">

            <DashboardCard title="Tus Ventas">
                {Array.isArray(pedidos) ? (
                    pedidos.map((pedido) => {
                        const limpiaCadena = pedido.fotos_pedido.replace(/\\/g, '').replace(/"{/g, '[').replace(/}"/g, ']');
                        const tuplas = limpiaCadena.slice(2, -2).split('","');
                        const objetosJSON = tuplas.map(tupla => {
                            const valores = tupla.split(',');
                            return {
                                id: parseInt(valores[0].slice(1)), // Elimina el paréntesis inicial
                                idFoto: parseInt(valores[1]),
                                idUsuario: parseInt(valores[2]),
                                url: valores[3],
                                precio: parseInt(valores[4]),
                                cantidad: parseInt(valores[5].slice(0, -1)), // Elimina el paréntesis final
                            };
                        });
                        return (
                            <Card key={pedido.idpedido} style={{ marginTop: '16px' }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        Pedido#{pedido.idpedido}
                                    </Typography>
                                    <Typography variant="h5" component="div">
                                        {pedido.nombre_comprador}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        {pedido.correo_comprador}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        {pedido.fecha}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        {pedido.direccion_comprador}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Estado de entrega : {pedido.estado}
                                    </Typography>
                                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                        {objetosJSON.map((foto, index) => (
                                            <div key={index}>
                                                <Card key={foto.id} sx={{ width: '100%', padding: '5px' }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="80%"
                                                        style={{ objectFit: 'contain' }}
                                                        image={foto.url}
                                                        alt="Paella dish"
                                                    />
                                                    <CardActions disableSpacing>
                                                        Vendido por : {foto.precio}Bs
                                                    </CardActions>
                                                </Card>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardActions>
                                    <Button type="button" size="small" onClick={() => handleOpen(pedido.idpedido, pedido.estado)}>
                                        Actualizar datos
                                    </Button>
                                </CardActions>
                            </Card>
                        );
                        // Analizar la cadena JSON en un objeto

                    })
                ) : (
                    <Typography variant="body1">No tienes pedidos pendientes en este momento.</Typography>
                )}
            </DashboardCard>

            <Dialog open={open} onClose={handleClose} aria-labelledby="draggable-dialog-title">
                <DialogTitle id="draggable-dialog-title">
                    Cambiar información del pedido
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label=""
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={estadope}
                        onChange={handleEstadoChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={() => handleActualizar()} style={{ marginTop: 16 }}>
                        Actualizar Información
                    </Button>
                    <Button variant="contained" color="warning" onClick={() => handleClose()} style={{ marginTop: 16, marginLeft: 20 }}>
                        Cancelar
                    </Button>

                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000} // Duración en milisegundos que estará abierto el Snackbar
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            />
        </PageContainer>
    );
};

export default Pedido;
