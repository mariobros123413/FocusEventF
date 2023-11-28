import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, CardMedia, Button } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import api from 'src/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Compras = () => {
    const [pedidos, setPedidos] = useState([]);
    const [clicked,] = useState(false);
    const localData = window.localStorage.getItem('loggedFocusEvent');
    const localDataParsed = JSON.parse(localData);
    const userData = JSON.parse(localDataParsed.userData);
    const navigate = useNavigate();

    useEffect(() => {
        obtenerDatos();
        window.addEventListener('keydown', handleKeyDown);

        // Configurar un intervalo que limpie el portapapeles cada 2 segundos
        // const clipboardClearInterval = setInterval(async () => {
        //     try {
        //         if (document.hasFocus()) {
        //             await navigator.clipboard.writeText('');
        //             // Mostrar alerta después de que la operación de copiar al portapapeles se haya completado
        //             // alert('Contenido del portapapeles eliminado.');
        //         } else {
        //             console.log('documento no focussed')
        //         }
        //     } catch (error) {
        //         // console.error('Error al limpiar el portapapelesssss:', error);
        //         // navigate('/evento')

        //     }
        // }, 1);
        // document.addEventListener('visibilitychange', handleVisibilityChange);
        // // window.addEventListener('blur', handleWindowBlur);
        // document.addEventListener('contextmenu', function (e) {
        //     e.preventDefault();
        // });
        // // Limpiar el event listener y detener el intervalo al desmontar el componente
        // return () => {
        //     // window.removeEventListener('keydown', handleKeyDown);
        //     clearInterval(clipboardClearInterval);
        //     // document.removeEventListener('visibilitychange', handleVisibilityChange);
        // };
    }, [clicked]); // El segundo argumento [] garantiza que useEffect se ejecute solo una vez al montar el componente


    const handleKeyDown = (event) => {
        // console.log(`event : ${event.key}`)
        // Evitar captura de pantalla con combinación de teclas (por ejemplo, Ctrl + Shift + I)
        if (event.metaKey || event.shiftKey || event.key === 'PrintScreen' || event.keyCode === 123) {
            event.preventDefault();
            navigate('/dashboard');
        }
    };
    const obtenerDatos = async () => {
        try {
            // Obtener pedidos del usuario
            const responsePedidos = await api.get(`/carrito/obtenerPedidos/${userData.id}`); // Reemplaza 1 con el ID de usuario real
            const pedidosData = responsePedidos.data;
            if (responsePedidos.status <= 300) {
                const pedidosConFotos = await Promise.all(
                    pedidosData.map(async (pedido) => {
                        const responseFotos = await api.get(`/carrito/obtenerFotosPedido/${pedido.id}`);
                        const fotosPedido = responseFotos.data;

                        // Formatear la fecha
                        const fechaCompraFormateada = new Date(pedido.fechacompra).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        });

                        return { ...pedido, fotos: fotosPedido, fechacompra: fechaCompraFormateada };
                    })
                );

                console.log(`pedidos con fotos :${JSON.stringify(pedidosConFotos)}`);
                setPedidos(pedidosConFotos);
            }
            // Para cada pedido, obtener fotos y formatear la fecha

        } catch (error) {
            console.error('Error al obtener pedidos:', error);
        }
    };
    const handleDownloadImage = async (imageUrl) => {
        try {
            // Llamar a la API de descarga
            const response = await api.get(`/carrito/image?imageUrl=${imageUrl}`, { responseType: 'arraybuffer' });

            // Crear un blob con la respuesta
            const blob = new Blob([response.data], { type: 'image/jpeg' });

            // Crear un enlace para descargar la imagen
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'GraciasPorSuCompra.jpg';

            // Simular un clic en el enlace para iniciar la descarga
            downloadLink.click();

            // Limpiar el objeto URL
            URL.revokeObjectURL(downloadLink.href);
        } catch (error) {
            console.error('Error al descargar la imagen:', error);
        }
    };



    return (
        <PageContainer title="Pedidos del Usuario" description="Lista de pedidos y sus fotos">
            {Array.isArray(pedidos) && pedidos.length > 0 ? (
                pedidos.map((pedido) => (
                    <DashboardCard key={pedido.id} title={`Pedido #${pedido.id}`}>
                        <Typography variant="subtitle1">Fecha del pedido: {pedido.fechacompra}</Typography>
                        <Typography variant="subtitle1">Estado del pedido: {pedido.estado}</Typography>

                        <Typography variant="h6">Fotos del pedido:</Typography>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {pedido.fotos.map((foto) => (
                                <Card key={foto.id} style={{ margin: '8px', maxWidth: '200px' }}>
                                    <CardMedia component="img" height="140" image={foto.url} alt={`Foto ${foto.id}`} />
                                    <CardContent>
                                        <div>
                                            <Typography variant="caption">ID Item: {foto.id}</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="caption">Precio: {foto.precio} BS</Typography>
                                        </div>
                                        <div>
                                            <Typography variant="caption">Fotógrafo: {foto.correo}</Typography>
                                        </div>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleDownloadImage(foto.url)}
                                            style={{ marginTop: '8px' }}
                                        >
                                            Descargar
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </DashboardCard>
                ))) : (
                <Typography variant="body1">No tienes compras este momento.</Typography>

            )}
        </PageContainer>
    );
};

export default Compras;
