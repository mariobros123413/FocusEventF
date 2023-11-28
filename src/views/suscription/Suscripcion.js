import React, { useState } from 'react';
import { Typography, Grid, Box, Paper, Snackbar } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { PayPalButton } from 'react-paypal-button-v2';
import api from 'src/axiosInstance';

const Suscripcion = () => {
    const localData = window.localStorage.getItem('loggedFocusEvent');
    const localDataParsed = JSON.parse(localData);
    const userData = JSON.parse(localDataParsed.userData);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const subscriptionStyles = {
        background: '#5D87FF', // Color de fondo cian
        padding: '16px',
        textAlign: 'center',
    };

    const handlePagarConPayPal = async (details, data) => {
        try {
            if (details.status === 'COMPLETED') {
                if (details.purchase_units[0].amount.value === '15.00') {
                    const response = await api.patch(`/usuario/setAnfitrion/${userData.id}`);
                    if (response.status <= 250) {
                        console.log('Response', response.data);
                        userData.idtipousuario = 3;
                        // Almacena el objeto userData actualizado en el localStorage
                        localDataParsed.userData = JSON.stringify(userData);
                        window.localStorage.setItem('loggedFocusEvent', JSON.stringify(localDataParsed));
                        setSnackbarMessage('Gracias por su compra! Disfrute con sus eventos!');
                        setSnackbarOpen(true);
                        setInterval(async () => {
                            window.location.reload();
                        }, 3000);
                    } else {
                        setSnackbarMessage('Error al procesar el pago con PayPal');
                        setSnackbarOpen(true);
                    }
                } else {
                    const response = await api.patch(`/usuario/setFotografo/${userData.id}`);
                    if (response.status <= 250) {
                        userData.idtipousuario = 1;
                        // Almacena el objeto userData actualizado en el localStorage
                        localDataParsed.userData = JSON.stringify(userData);
                        window.localStorage.setItem('loggedFocusEvent', JSON.stringify(localDataParsed));
                        setSnackbarMessage('Gracias por su compra! Disfrute la exclusividad');
                        setSnackbarOpen(true);
                        setInterval(async () => {
                            window.location.reload();
                        }, 3000);
                    } else {
                        setSnackbarMessage('Error al procesar el pago con PayPal');
                        setSnackbarOpen(true);
                    }
                }
            } else {
                console.error('Error al procesar el pago con PayPal');
                setSnackbarMessage('Error al procesar el pago con PayPal');
                setSnackbarOpen(true);
            }
        } catch (error) {
            setSnackbarMessage('Error inesperado, intentelo más tarde');
            setSnackbarOpen(true);
        }
    };

    return (
        <PageContainer title="Suscripciones" description="Explora nuestras opciones de suscripción">

            <Grid container spacing={3}>
                {/* Suscripción Gratuita */}
                <Grid item xs={12} sm={4} width={'300px'}>
                    <Paper style={subscriptionStyles}>
                        <Typography variant="h5">Suscripción Gratuita</Typography>
                    </Paper>
                    <DashboardCard title="">
                        <Box display="flex" alignItems="baseline">
                            <Typography variant="h1" mr={1}>
                                US$ 0
                            </Typography>
                            <Typography variant="subtitle1">/mes</Typography>
                        </Box>
                        <Typography variant="body1">
                            Disfruta de los siguientes beneficios con nuestra suscripción gratuita:
                        </Typography>
                        <ul>
                            <li>Acceso a participar en eventos</li>
                            <li>Compra fotos, compra recuerdos</li>
                            {/* Agrega más beneficios según sea necesario */}
                        </ul>
                    </DashboardCard>
                </Grid>

                {/* Suscripción de Anfitrión */}
                <Grid item xs={12} sm={4}>
                    <Paper style={subscriptionStyles}>
                        <Typography variant="h5">Suscripción Anfitrión</Typography>
                    </Paper>
                    <DashboardCard title="">
                        <Box display="flex" alignItems="baseline">
                            <Typography variant="h1" mr={1}>
                                US$ 15
                            </Typography>
                            <Typography variant="subtitle1">/mes</Typography>
                        </Box>
                        <Typography variant="body1">
                            Conviértete en un anfitrión y disfruta de ventajas como:
                        </Typography>
                        <ul>
                            <li>Publica y gestiona eventos</li>
                            <li>Gestiona tus invitaciones</li>
                            <li>Contrata fotógrafos</li>
                            {/* Agrega más beneficios según sea necesario */}
                        </ul>
                        {userData.idtipousuario === 1 || userData.idtipousuario === 3 ? (
                            <Typography variant="body1" align="center" paddingBottom={'10px'}>
                                ¡Este plan está activado!
                            </Typography>
                        ) : (
                            <div>
                                <Typography variant="body1" align='center' paddingBottom={'10px'}>
                                    ¡Únete como Anfitrión!
                                </Typography>
                                <PayPalButton
                                    id="paypal-button"
                                    amount={15}
                                    onSuccess={(details, data) => handlePagarConPayPal(details, data)}
                                    options={{
                                        clientId: 'AbeMslKVUFU1u7IhHKO06EHbe8DkhGdg-9CLAF8VBZ2i9yNjwFmCicGa5-ehRmOiDnhd4P_jXsCZSs8D',
                                        currency: 'USD',
                                    }}
                                />
                            </div>
                        )}

                    </DashboardCard>
                </Grid>

                {/* Suscripción Premium */}
                <Grid item xs={12} sm={4}>
                    <Paper style={subscriptionStyles}>
                        <Typography variant="h5">Suscripción Premium</Typography>
                    </Paper>
                    <DashboardCard title="">
                        <Box display="flex" alignItems="baseline">
                            <Typography variant="h1" mr={1}>
                                US$ 35
                            </Typography>
                            <Typography variant="subtitle1">/mes</Typography>
                        </Box>
                        <Typography variant="body1">
                            Obtén lo mejor con nuestra suscripción premium, que incluye:
                        </Typography>
                        <ul>
                            <li>Obtén el rol de Fotógrafo</li>
                            <li>Publica tantas fotos como quieras</li>
                            <li>Vende tus propias fotos</li>
                            <li>Administra tus ventas</li>
                            <li>¡Además conserva los beneficios anteriores!</li>
                            {/* Agrega más beneficios según sea necesario */}
                        </ul>
                        {userData.idtipousuario === 1 ? (
                            <Typography variant="body1" align="center" paddingBottom={'10px'}>
                                ¡Este plan está activado!
                            </Typography>
                        ) : (<div>
                            <Typography variant="body1" align='center' paddingBottom={'10px'}>
                                ¡Actualiza a Premium!
                            </Typography>
                            <PayPalButton
                                id="paypal-button"
                                amount={35}
                                onSuccess={(details, data) => handlePagarConPayPal(details, data)}
                                options={{
                                    clientId: 'AbeMslKVUFU1u7IhHKO06EHbe8DkhGdg-9CLAF8VBZ2i9yNjwFmCicGa5-ehRmOiDnhd4P_jXsCZSs8D',
                                    currency: 'USD',
                                }}
                            />
                        </div>
                        )}
                    </DashboardCard>
                </Grid>
            </Grid>
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

export default Suscripcion;
