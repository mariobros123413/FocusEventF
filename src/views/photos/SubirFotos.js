import React, { useState, useEffect } from 'react';
import { Button, Card, CardMedia, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, CardActions, Snackbar } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { FileUploadOutlined } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import api from 'src/axiosInstance';

const SubirFotos = () => {
    const { nombre, idgaleria } = useParams();
    const [selectedFile, setSelectedFile] = useState(null);
    const [precio, setPrecio] = useState();
    const [precioc, setPrecioc] = useState();
    const [fotos, setFotos] = useState([]);
    const [open, setOpen] = useState(false);
    const [openElim, setOpenElim] = useState(false);
    const [openPrecio, setOpenPrecio] = useState(false);
    const [idfoto, setidFoto] = useState();
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const localData = window.localStorage.getItem('loggedFocusEvent');
    const localDataParsed = JSON.parse(localData);
    const userData = JSON.parse(localDataParsed.userData);
    const handleCloseElim = () => setOpenElim(false);
    const handleClosePrecio = () => setOpenPrecio(false);

    const handleElimFoto = async () => {
        try {
            // Usa el id del evento almacenado para hacer la solicitud de eliminación
            await api.delete(`/galeria/eliminarFoto/${idfoto}`);
            setOpenElim(false); // Cierra el diálogo después de eliminar con éxito
            obtenerFotos();
        } catch (error) {
            console.error('Error al eliminar evento:', error);
        }
    };

    const handleActualizarPrecio = async () => {
        try {
            // Usa el id del evento almacenado para hacer la solicitud de eliminación
            await api.patch(`/galeria/actualizarFoto/${idfoto}`, {
                precio: precioc
            });
            setOpenPrecio(false); // Cierra el diálogo después de eliminar con éxito
            obtenerFotos();
        } catch (error) {
            console.error('Error al eliminar evento:', error);
        }
    };
    useEffect(() => {
        obtenerFotos();
    }, []);

    const handleFileChange = (event) => {
        const file = (event && event.target && event.target.files) ? event.target.files[0] : null;
        if (file) {
            setSelectedFile(file);
            openModal();
        }
    };
    const handlePrecioChange = (event) => {
        // Asegúrate de que solo se ingresen números
        const inputValue = event.target.value.replace(/[^0-9]/g, '');
        setPrecio(inputValue);
    };
    const handlePreciocChange = (event) => {
        // Asegúrate de que solo se ingresen números
        const inputValue = event.target.value.replace(/[^0-9]/g, '');
        setPrecioc(inputValue);
    };
    const handleAddFoto = () => {
        if (selectedFile && precio) {
            const precioEntero = parseInt(precio, 10);
            const idgalerias = parseInt(idgaleria, 10);

            const formDataObject = {
                precio: precioEntero,
                nombre: nombre,
                idgaleria: idgalerias,
                idfotografo: userData.id,
                foto: selectedFile,
            };

            // Muestra los datos en la consola antes de enviar
            console.log('Datos del formulario:', formDataObject);

            // Luego, puedes enviar estos datos al servidor usando formData
            const formData = new FormData();
            formData.append('precio', precioEntero);
            formData.append('nombre', nombre);
            formData.append('idgaleria', idgalerias);
            formData.append('idfotografo', userData.id);
            formData.append('foto', selectedFile);
            api.post('galeria/subirFoto', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                // Puedes incluir más configuraciones si es necesario
            })
                .then(response => {
                    // Maneja la respuesta del servidor, si es necesario
                    setSnackbarMessage('Se subió correctamente la foto');
                    setSnackbarOpen(true);
                })
                .catch(error => {
                    // Maneja cualquier error que pueda ocurrir durante la solicitud
                    setSnackbarMessage('Error al subir la foto');
                    setSnackbarOpen(true);
                })
                .finally(() => {
                    // Cierra el modal después de subir la foto, si es necesario
                    closeModal();
                });
        } else {
            setSnackbarMessage('Todos los campos son obligatorios');
            setSnackbarOpen(true);
        }
    };

    const openModal = () => {
        setOpen(true);
    };
    const openModalPrecio = (idfotoc) => {
        setidFoto(idfotoc)
        setOpenPrecio(true);
    };
    const openModalElim = (idfotoc) => {
        setidFoto(idfotoc);
        setOpenElim(true);
    };
    const closeModal = () => {
        setOpen(false);
        setSelectedFile(null);
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.value = null;
        }
    };
    const obtenerFotos = async () => {
        try {
            console.log(`galeria : ${idgaleria}`)
            const response = await api.get(`/galeria/${userData.id}/${idgaleria}`);
            console.log(response.data)
            setFotos(response.data);
        } catch (error) {
            console.error('Error al obtener eventos:', error);
        }
    };
    return (
        <PageContainer title="Subir Fotos" description="Agrega fotos al evento">
            <DashboardCard title="Sube tus fotos para este evento">
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<FileUploadOutlined />}
                    onClick={() => {
                        const fileInput = document.getElementById('file-input');
                        if (fileInput) {
                            fileInput.value = null;
                        }
                        handleFileChange();
                    }}
                >
                    Subir archivo
                    <input
                        id="file-input"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </Button>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>

                    {fotos.filter((foto) => foto.usuariomostrar).sort((a, b) => a.id - b.id)
                        .map((foto) => (
                            <Card key={foto.id} sx={{ width: '30%', margin: '15px' }}>
                                {/* <CardHeader
                                    avatar={
                                    <Avatar sx={{ bgcolor: colors.red[500] }} aria-label="recipe">
                                        R
                                    </Avatar>
                                    }
                                    title="Shrimp and Chorizo Paella"
                                    subheader="September 14, 2016"
                                /> */}
                                <CardMedia
                                    component="img"
                                    height="85%"
                                    style={{ objectFit: 'contain' }}
                                    image={foto.url}
                                    alt="Paella dish"
                                />
                                <CardActions disableSpacing>
                                    <Button onClick={() => openModalElim(foto.id)} color="primary">
                                        Eliminar Foto
                                    </Button>
                                    <Button onClick={() => openModalPrecio(foto.id)} color="primary">
                                        Actualizar Precio :
                                    </Button>

                                    {foto.precio}Bs
                                </CardActions>
                            </Card>
                        ))}
                </div>
            </DashboardCard>
            <Dialog open={open} onClose={closeModal} aria-labelledby="draggable-dialog-title">
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Confirmar Foto
                </DialogTitle>
                <DialogContent>
                    <CardMedia
                        id="file-input"
                        component="img"
                        height="85%"
                        style={{ objectFit: 'contain' }}
                        image={selectedFile ? URL.createObjectURL(selectedFile) : ''}
                        alt="Vista previa"
                    />
                    <TextField
                        label="Nombre del evento"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={nombre}
                        contentEditable={false}
                    />
                    <TextField
                        label="Precio de la foto"
                        type='text'  // Cambiado de 'number' a 'text' para permitir la manipulación del evento onChange
                        multiline
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={precio}
                        onChange={handlePrecioChange}
                        InputProps={{
                            inputProps: {
                                pattern: '[0-9]*',  // Expresión regular para aceptar solo números
                            },
                        }}
                    />
                    <DialogContentText>
                        ¿Estás seguro de que deseas subir esta foto?
                    </DialogContentText>
                </DialogContent>
                <CardActions>
                    <Button autoFocus onClick={closeModal} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleAddFoto} color="primary">
                        Subir Foto
                    </Button>
                </CardActions>
            </Dialog>
            <Dialog open={openPrecio} onClose={handleClosePrecio} aria-labelledby="draggable-dialog-title">
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Actualiza el precio de la foto
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Precio de la foto"
                        type='text'  // Cambiado de 'number' a 'text' para permitir la manipulación del evento onChange
                        multiline
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={precioc}
                        onChange={handlePreciocChange}
                        InputProps={{
                            inputProps: {
                                pattern: '[0-9]*',  // Expresión regular para aceptar solo números
                            },
                        }}
                    />
                </DialogContent>
                <CardActions>
                    <Button onClick={handleActualizarPrecio} color="primary">
                        Actualizar
                    </Button>
                    <Button onClick={handleClosePrecio} color="primary">
                        Cancelar
                    </Button>
                </CardActions>
            </Dialog>
            <Dialog open={openElim} onClose={handleCloseElim} aria-labelledby="draggable-dialog-title">
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Confirmar Eliminación
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <CardActions>
                    <Button onClick={handleElimFoto} color="primary">
                        Eliminar Foto
                    </Button>
                    <Button onClick={handleCloseElim} color="primary">
                        Cancelar
                    </Button>
                </CardActions>
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

export default SubirFotos;
