import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    CardMedia,
    CardActions,
    CardContent,
    Typography,
    Snackbar
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';
import api from 'src/axiosInstance';
import { PayPalButton } from 'react-paypal-button-v2';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const localData = window.localStorage.getItem('loggedFocusEvent');
    const localDataParsed = JSON.parse(localData);
    const userData = JSON.parse(localDataParsed.userData);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        obtenerFotosEnCarrito();
        window.addEventListener('keydown', handleKeyDown);

        // Configurar un intervalo que limpie el portapapeles cada 2 segundos
        const clipboardClearInterval = setInterval(async () => {
            try {
                if (document.hasFocus()) {
                    await navigator.clipboard.writeText('');
                    // Mostrar alerta después de que la operación de copiar al portapapeles se haya completado
                    // alert('Contenido del portapapeles eliminado.');
                } else {
                    console.log('documento no focussed')
                }
            } catch (error) {
                // console.error('Error al limpiar el portapapelesssss:', error);
                // navigate('/evento')

            }
        }, 1);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        // window.addEventListener('blur', handleWindowBlur);
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
        // Limpiar el event listener y detener el intervalo al desmontar el componente
        return () => {
            // window.removeEventListener('keydown', handleKeyDown);
            clearInterval(clipboardClearInterval);
            // document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [clicked]);

    function handleVisibilityChange(event) {
        // Verificar si la página está oculta (no enfocada)
        if (document.hidden && clicked === false) {
            // Redirigir a "/evento" si el usuario no está operando en tu aplicación
            navigate('/evento');
        }
    }

    const handleKeyDown = (event) => {
        // console.log(`event : ${event.key}`)
        // Evitar captura de pantalla con combinación de teclas (por ejemplo, Ctrl + Shift + I)
        if (event.metaKey || event.shiftKey || event.key === 'PrintScreen' || event.keyCode === 123) {
            event.preventDefault();
            setSnackbarMessage('Captura de pantalla deshabilitada');
            setSnackbarOpen(true);
            navigate('/evento');
        }
    };
    const obtenerFechaHoraActual = () => {
        const fechaHoraActual = new Date();
        return fechaHoraActual.toISOString(); // Convierte la fecha y hora a una cadena en formato ISO
    };
    const obtenerFotosEnCarrito = async () => {
        try {
            const response = await api.get(`/carrito/obtenerCarrito/${userData.id}`); // Agrega la URL correcta para obtener los elementos del carrito
            setCartItems(response.data);
        } catch (error) {
            console.error('Error al obtener fotos del carrito:', error);
        }
    };

    const handleEliminarFoto = async (idfoto) => {
        // Lógica para eliminar la foto del carrito
        try {
            // Llama a la API para eliminar la foto del carrito
            await api.delete(`/carrito/eliminarFotoCarrito/${userData.id}`, {
                "idfoto": idfoto,
            });
            // Actualiza la lista de fotos en el carrito
            obtenerFotosEnCarrito();
        } catch (error) {
            console.error('Error al eliminar foto del carrito:', error);
        }
    };
    const handlePagarConPayPal = async (details, data) => {

        try {
            // Lógica para enviar la confirmación del pago a tu servidor
            // Aquí puedes enviar details.paymentID, details.payerID y cualquier otra información relevante
            // a tu servidor para procesar la confirmación del pago.
            console.log('Payment details:', details.status);
            console.log('Payment data:', data);
            const fechaHoraActual = obtenerFechaHoraActual();
            const arrayDeFotos = cartItems.map((item) => ({
                idfoto: item.idfoto,
                idfotografo: item.idfotografo,
                precio: item.precio,
                // Agrega otras propiedades según la estructura de tu objeto de foto
            }));
            if (details.status === 'COMPLETED') {
                const response = await api.post(`/carrito/crearPedido/${userData.id}`, {
                    "fechacompra": fechaHoraActual,
                    "fotos": arrayDeFotos
                })
                if (response.status <= 250) {
                    const responses = await api.delete(`/carrito/eliminarCarrito/${userData.id}`);
                    if (responses.status <= 250) {
                        setSnackbarMessage('Pago con éxito');
                        setSnackbarOpen(true);
                        obtenerFotosEnCarrito();

                    } else {
                        console.error('Error al eliminar carrito', responses.data);
                    }
                } else {
                    console.error('Error al crear pedido', response.data);
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
    const calcularTotal = () => {
        if (!Array.isArray(cartItems)) {
            return 0; // o cualquier valor por defecto
        }

        const totalSinRedondeo = cartItems.reduce((total, item) => total + item.cantidad * item.precio / 6.97, 0);
        const totalRedondeado = totalSinRedondeo.toFixed(2);
        return parseFloat(totalRedondeado);
    };

    const handlePayPalButtonClick = () => {
        // Realizar cualquier acción adicional si es necesario
        console.log('Botón de PayPal clickeado');
        setClicked(true);
    };

    return (
        <PageContainer title="Carrito de Compras" description="Lista de Fotos en el Carrito">
            <DashboardCard title="Fotos en el Carrito">
                {Array.isArray(cartItems) && cartItems.length > 0 ? ( //tambien corregi en la hackathon, {Array.isArray(cartItems) ?(
                    <Card sx={{ marginTop: 2 }}>
                        <Typography variant="h6" color="text.primary">
                            Total a Pagar: {calcularTotal()} USD
                        </Typography>
                        <CardActions>
                            {/* Agrega el botón de PayPal aquí con el total */}
                            <PayPalButton
                                id="paypal-button"
                                amount={calcularTotal()}
                                onClick={handlePayPalButtonClick}  // Puedes manejarlo directamente aquí si no necesitas acciones adicionales
                                onSuccess={(details, data) => handlePagarConPayPal(details, data)}
                                options={{
                                    clientId: 'AbeMslKVUFU1u7IhHKO06EHbe8DkhGdg-9CLAF8VBZ2i9yNjwFmCicGa5-ehRmOiDnhd4P_jXsCZSs8D', // Reemplaza con tu propio ID de cliente de PayPal
                                    currency: 'USD',
                                }}
                            />
                        </CardActions>
                    </Card>
                ) : (
                    <CardContent>
                        <Typography variant="h6" color="text.primary">
                            No tienes fotos en el carrito
                        </Typography>
                    </CardContent>
                )}
                {Array.isArray(cartItems) ? (
                    cartItems.map((item) => (
                        <Card key={item.idfoto} sx={{ marginBottom: 2 }}>
                            <CardMedia
                                component="img"
                                alt={item.nombre}
                                height="140"
                                image={item.url} // Agrega la propiedad de la URL según la estructura de tu objeto
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    Cantidad: {item.cantidad}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Precio: {item.precio} Bs
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total: {item.cantidad * item.precio} Bs
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    onClick={() => handleEliminarFoto(item.idfoto)}
                                >
                                    Eliminar
                                </Button>
                            </CardActions>
                        </Card>
                    ))
                ) : (
                    <Typography variant="body2" color="text.primary" style={{ paddingTop: '30px' }}>

                    </Typography>
                )}

            </DashboardCard>
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

export default Cart;

