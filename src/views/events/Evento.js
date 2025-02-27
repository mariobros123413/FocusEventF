import React, { useState, useEffect } from 'react';
import { Typography, Button, TextField, Card, CardContent, CardActions, Dialog, FormControlLabel, Checkbox, DialogTitle, DialogContent, DialogContentText, Modal, Snackbar } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import './evento.css';
import api from 'src/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Evento = () => {
    const [open, setOpen] = useState(false);
    const [openElim, setOpenElim] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openInv, setOpenInv] = useState(false);
    const [openVer, setOpenVer] = useState(false);

    const [correos, setCorreos] = useState([
        { correo: '', esFotografo: false },
    ]);
    const [invitaciones, setInvitaciones] = useState(['']); // Inicializamos con un campo vacío
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [direccion, setDireccion] = useState('');
    const [selectedDate, setSelectedDate] = useState(''); // Estado para la fecha seleccionada
    const [selectedTime, setSelectedTime] = useState(''); // Estado para la hora seleccionada
    const [eventoAEliminar, setEventoAEliminar] = useState(null);
    const [eventoInvitar, setEventoInvitar] = useState(null);
    ////////////////////////////////<EDITED>
    const [nombreEdited, setNombreEdited] = useState('');
    const [descripcionEdited, setDescripcionEdited] = useState('');
    const [direccionEdited, setDireccionEdited] = useState('');
    const [editedDate, setEditedDate] = useState('');
    const [editedTime, setEditedTime] = useState('');
    ///////////////////////////////</EDITED>
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const localData = window.localStorage.getItem('loggedFocusEvent');
    const localDataParsed = JSON.parse(localData);
    const userData = JSON.parse(localDataParsed.userData);
    const [eventos, setEventos] = useState([]);
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        obtenerEventos();
        const clipboardClearInterval = setInterval(async () => {
            try {
                if (document.hasFocus()) {
                    await navigator.clipboard.writeText('');
                    // Mostrar alerta después de que la operación de copiar al portapapeles se haya completado
                    // alert('Contenido del portapapeles eliminado.');
                }
            } catch (error) {
                // console.error('Error al limpiar el portapapelesssss:', error);
                // navigate('/evento')

            }
        }, 1);
        // // setInterval para actualizar eventos cada X milisegundos
        // setInterval para actualizar eventos cada X milisegundos
        // Limpia el intervalo cuando el componente se desmonta
        return () => {
            clearInterval(clipboardClearInterval);
        };
    }, []);
    const handleNavigateFotos = async (idevento, idgaleria) => {
        try {
            navigate(`/evento/${idevento}/${idgaleria}/fotos`);
            obtenerEventos();
        } catch (error) {
            // Manejar errores, por ejemplo, mostrar un mensaje al usuario
            console.error('Error al crear la reunión:', error);
        }
    };

    const handleClose = () => setOpen(false);
    const handleOpenCreate = () => setOpen(true);

    const handleCloseElim = () => setOpenElim(false);
    const handleOpenElim = (idevento) => {
        setOpenElim(true);
        // Aquí puedes almacenar el id del evento que se eliminará, ya sea en el estado o en una variable de referencia
        // Puedes usar la función setEventoAEliminar o useRef según tus necesidades
        setEventoAEliminar(idevento);
    };
    const handleOpenInv = (idevento) => {
        setOpenInv(true);
        setEventoInvitar(idevento);
    };
    const handleOpenVer = async (idevento) => {
        try {
            const response = await api.get(`evento/obtenerInvitados/${idevento}`);
            console.log(`response get inv : ${JSON.stringify(response.data)}`)
            setInvitaciones(response.data);
            setOpenVer(true);
        } catch (error) {
            console.log(`error handleOpen Ver : ${error}`)
        }

    };
    const [errores, setErrores] = useState(Array(correos.length).fill(false));


    const handleCorreoChange = (index, campo, valor) => {
        const nuevosCorreos = [...correos];
        nuevosCorreos[index] = { ...nuevosCorreos[index], [campo]: valor };

        // Validar el formato de correo
        const formatoCorreoValido = /^\S+@\S+\.\S+$/.test(valor);

        // Actualizar el estado de errores
        const nuevosErrores = [...errores];
        nuevosErrores[index] = !formatoCorreoValido;

        // Verificar si hay errores en el formato del correo
        // Actualizar el estado del botón

        setCorreos(nuevosCorreos);
        setErrores(nuevosErrores);
    };



    const handleAgregarCampo = () => {
        setCorreos([...correos, { correo: '', esFotografo: false }]);
    };
    const handleEnviarInvitaciones = async () => {
        const correosActivados = [];
        const correosDesactivados = [];

        correos.forEach((invitado) => {
            if (invitado.esFotografo) {
                correosActivados.push(invitado.correo);
            } else {
                correosDesactivados.push(invitado.correo);
            }
        });
        try {
            await api.post(`/evento/invitarFotografos/${eventoInvitar}`, correosActivados);
            await api.post(`/evento/invitarEvento/${eventoInvitar}`, correosDesactivados);
            console.log('Correos con checkbox activado:', correosActivados);
            console.log('Correos con checkbox desactivado:', correosDesactivados);
            // console.log('Invitaciones enviadas:', response.data);
            // Puedes manejar la respuesta según tus necesidades
            handleCloseInv(true);
        } catch (error) {
            setSnackbarMessage(`${error.response.data.message}`)
            setSnackbarOpen(true);
            console.error('Error al enviar invitaciones:', error);
            // Puedes manejar el error según tus necesidades
        }
    };
    const handleEliminarInvitacion = async (idevento, idusuario, correo) => {
        // Aquí puedes hacer algo con el array de correos (por ejemplo, enviar a tu servidor)
        try {
            await api.delete(`/evento/eliminarInvitado/${idevento}/${idusuario}`);
            setSnackbarMessage(`El invitado con correo ${correo} fue eliminado correctamente`)
            setSnackbarOpen(true);
            handleCloseVerInv(true);
        } catch (error) {
            setSnackbarMessage(`Ocurrió un error al eliminar al usuario ${correo}`)
            setSnackbarOpen(true);
        }

    };

    const handleCloseInv = () => {
        setOpenInv(false);
        setCorreos(['']);
    };
    const handleCloseVerInv = () => {
        setOpenVer(false);
    };
    const handleCloseEdit = () => setOpenEdit(false);
    const handleOpenEdit = (evento) => {
        setOpenEdit(true);
        // Aquí puedes almacenar el id del evento que se eliminará, ya sea en el estado o en una variable de referencia
        // Puedes usar la función setEventoAEliminar o useRef según tus necesidades
        setNombreEdited(evento.nombre);
        setDescripcionEdited(evento.descripcion);
        setDireccionEdited(evento.nombre);
        setEditedDate(evento.fecha.substring(0, 10)); // Inicializa el estado de la hora editada
        setEditedTime(evento.fecha.substring(12, 17)); // Inicializa el estado de la hora editada
        setEventoSeleccionado(evento);
    };
    const handleNombreChange = (event) => {
        setNombre(event.target.value);
    };
    const handleDescripcionChange = (event) => {
        setDescripcion(event.target.value);
    };
    const handleDireccionChange = (event) => {
        setDireccion(event.target.value);
    };
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };
    const handleTimeChange = (event) => {
        setSelectedTime(event.target.value);
    };
    /////////////////////////<EDITED>
    const handleNombreEdited = (event) => {
        setNombreEdited(event.target.value);
    };
    const handleDescripcionEDited = (event) => {
        setDescripcionEdited(event.target.value);
    };
    const handleDireccionEdited = (event) => {
        setDireccionEdited(event.target.value);
    };
    const handleTimeChanges = (event) => {
        setEditedTime(event.target.value);
    };
    const handleDateChanges = (event) => {
        setEditedDate(event.target.value);
    };/////////////////////</EDITED>
    const handleCreateEvento = async () => {
        if (!nombre || !descripcion || !direccion || !selectedDate || !selectedTime) {
            // Si algún campo está vacío, muestra un Snackbar de error
            setSnackbarMessage('Todos los campos son obligatorios');
            setSnackbarOpen(true);
            return;
        }

        try {
            await api.post('/evento', {
                nombre: nombre,
                descripcion: descripcion,
                direccion: direccion,
                fecha: combineDateAndTime(selectedDate, selectedTime),
                idusuario: userData.id
            });
            setSnackbarMessage('Evento creado correctamente');
            setSnackbarOpen(true);
            setOpen(false);
            obtenerEventos();
        } catch (error) {
            setSnackbarMessage('Error al crear el evento');
            setSnackbarOpen(true);
        }
    };
    const handleUpdateEvento = async () => {
        if (!nombreEdited || !descripcionEdited || !direccionEdited || !editedDate || !editedTime) {
            // Si algún campo está vacío, muestra un Snackbar de error
            setSnackbarMessage('Todos los campos son obligatorios');
            setSnackbarOpen(true);
            obtenerEventos();
            return;
        }

        try {
            await api.patch(`/evento/${eventoSeleccionado.id}`, {
                nombre: nombreEdited,
                descripcion: descripcionEdited,
                direccion: direccionEdited,
                fecha: combineDateAndTime(editedDate, editedTime),
                idusuario: userData.id
            });
            setSnackbarMessage('Evento actualizado correctamente');
            setSnackbarOpen(true);
            setOpenEdit(false);
        } catch (error) {
            setSnackbarMessage('Error al crear el evento');
            setSnackbarOpen(true);
        }
    };
    const handleElimEvento = async () => {
        try {
            // Usa el id del evento almacenado para hacer la solicitud de eliminación
            await api.delete(`/evento/eliminarEvento/${eventoAEliminar}`);
            setOpenElim(false); // Cierra el diálogo después de eliminar con éxito
            obtenerEventos();
        } catch (error) {
            console.error('Error al eliminar evento:', error);
        }
    };
    const obtenerEventos = async () => {
        try {
            const response = await api.get(`/evento/obtenerEventos/${userData.id}`);
            setEventos(response.data);
        } catch (error) {
            console.error('No hay eventos:', error);
        }
    };
    const combineDateAndTime = (date, time) => {
        const [hour, minute] = time.split(':');
        const combinedDate = new Date(date);
        combinedDate.setDate(combinedDate.getDate() + 1);
        combinedDate.setHours(hour); // Restar 4 horas
        combinedDate.setMinutes(minute);

        // Formatear la fecha y hora para que se muestre como string
        const year = combinedDate.getFullYear();
        const month = String(combinedDate.getMonth() + 1).padStart(2, '0'); // Sumar 1 al mes porque en JavaScript los meses van de 0 a 11
        const day = String(combinedDate.getDate()).padStart(2, '0');
        const hours = String(combinedDate.getHours()).padStart(2, '0');
        const minutes = String(combinedDate.getMinutes()).padStart(2, '0');

        const formattedDateTime = `${year}-${month}-${day}  ${hours}:${minutes}`;
        return formattedDateTime;
    };
    return (
        <PageContainer title="Tus Eventos" description="">
            <DashboardCard title="Tus eventos">
                <Button color="primary" variant="contained" size="large" onClick={handleOpenCreate}>
                    Crear Evento +
                </Button>
                {/* Bucle para mostrar tarjetas de eventos */}
                {Array.isArray(eventos) ? (
                    eventos.map((evento) => (
                        <Card key={evento.id} style={{ marginTop: '16px' }} >
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {evento.nombre}
                                </Typography>
                                <Typography color="textSecondary">
                                    {evento.descripcion}
                                </Typography>
                                <Typography color="textSecondary">
                                    {evento.fecha}
                                </Typography>
                                <Typography color="textSecondary">
                                    {evento.codigo}
                                </Typography>
                                {/* Puedes agregar más detalles del evento aquí */}
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => handleOpenElim(evento.id)}>Eliminar</Button>
                                <Button size="small" onClick={() => handleOpenEdit(evento)}>
                                    Actualizar datos
                                </Button>
                                <Button size="small" onClick={() => handleNavigateFotos(evento.id, evento.idgaleria)}>
                                    Ver fotos
                                </Button>
                                <Button size="small" onClick={() => handleOpenInv(evento.id)}>
                                    Enviar invitaciones
                                </Button>
                                <Button size="small" onClick={() => handleOpenVer(evento.id)}>
                                    Ver Invitaciones
                                </Button>
                            </CardActions>
                        </Card>
                    ))) : (
                    <Typography color="textSecondary">
                        No creaste eventos
                    </Typography> //en hackathono hice el else, revisar
                )}
            </DashboardCard>

            {open && (
                <div className="modal-background">
                    <div className="modal-content">
                        <Typography variant="h5" gutterBottom>
                            Crea tu propio evento
                        </Typography>
                        <TextField
                            label="Nombre del evento"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={nombre}
                            onChange={handleNombreChange}
                        />
                        <TextField
                            label="Descripción del evento"
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={descripcion}
                            onChange={handleDescripcionChange}
                        />
                        <TextField
                            label="Dirección del evento"
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={direccion}
                            onChange={handleDireccionChange}
                        />
                        <div className="date-time-container">
                            <span className="date-time-label">Fecha:</span>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                            />
                        </div>
                        <div className="date-time-container">
                            <span className="date-time-label">Hora:</span>
                            <input
                                type="time"
                                value={selectedTime}
                                onChange={handleTimeChange}
                            />
                        </div>
                        <Button variant="contained" color="primary" onClick={handleCreateEvento} style={{ marginTop: 16 }}>
                            Crear evento
                        </Button>
                        <Button variant="contained" color="warning" onClick={handleClose} style={{ marginTop: 16, marginLeft: 20 }}>
                            Cancelar
                        </Button>

                    </div>
                </div>
            )}
            {openElim && (
                <Dialog open={openElim} onClose={handleCloseElim} aria-labelledby="draggable-dialog-title">
                    <DialogTitle id="draggable-dialog-title">
                        Confirmar Eliminación
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            ¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.
                        </DialogContentText>
                    </DialogContent>
                    <CardActions>
                        <Button autoFocus onClick={handleCloseElim} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={handleElimEvento} color="primary">
                            Eliminar
                        </Button>
                    </CardActions>
                </Dialog>
            )}
            {openEdit && (
                <Modal open={openEdit} onClose={handleCloseEdit} aria-labelledby="draggable-dialog-title">
                    <div className="modal-background">
                        <div className="modal-content">
                            <Typography variant="h5" gutterBottom>
                                Detalles del Evento
                            </Typography>
                            <TextField
                                label="Nombre del evento"
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                value={nombreEdited}
                                onChange={handleNombreEdited}
                            />
                            <TextField
                                label="Descripción del evento"
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                value={descripcionEdited}
                                onChange={handleDescripcionEDited}
                            />
                            <TextField
                                label="Dirección del evento"
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                value={direccionEdited}
                                onChange={handleDireccionEdited}
                            />
                            <div className="date-time-container">
                                <span className="date-time-label">Fecha:</span>
                                <input
                                    type="date"
                                    value={editedDate} // Obtener la parte de la fecha (YYYY-MM-DD)
                                    onChange={handleDateChanges}
                                />
                            </div>
                            <div className="date-time-container">
                                <span className="date-time-label">Hora:</span>
                                <input
                                    type="time"
                                    value={editedTime}
                                    onChange={handleTimeChanges}
                                />
                            </div>
                            {/* Agrega más detalles del evento aquí */}
                            <Button variant="contained" color="secondary" onClick={handleUpdateEvento} style={{ marginTop: 16 }}>
                                Actualizar evento
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCloseEdit}
                                style={{ marginTop: 16, marginLeft: 20 }}
                            >
                                Cerrar
                            </Button>

                        </div>
                    </div>
                </Modal>
            )}
            {openInv && (
                <div className="modal-background">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: '500px' }}>
                        <Typography variant="h5" gutterBottom>
                            Lista de invitados
                        </Typography>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {correos.map((invitado, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        label={`Correo electrónico ${index + 1}`}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                        value={invitado.correo}
                                        onChange={(e) => handleCorreoChange(index, 'correo', e.target.value)}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={invitado.esFotografo}
                                                onChange={(e) => handleCorreoChange(index, 'esFotografo', e.target.checked)}
                                            />
                                        }
                                        label="¿Es fotógrafo?"
                                    />
                                </div>
                            ))}
                        </div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEnviarInvitaciones}
                            style={{ marginTop: 16 }}
                        >
                            Enviar invitaciones
                        </Button>

                        <Button variant="contained" color="warning" style={{ marginTop: 16, marginLeft: 20 }} onClick={() => window.location.reload()}>
                            Cancelar
                        </Button>
                        <Button variant="contained" color="success" onClick={handleAgregarCampo} style={{ marginTop: 16, marginLeft: 20 }}>
                            +
                        </Button>
                    </div>
                </div>
            )}
            {openVer && (
                <div className={`modal-background ${openVer ? 'open' : ''}`} onClick={handleCloseVerInv}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <Typography variant="h5" gutterBottom>
                            Lista de invitados
                        </Typography>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {invitaciones.map((invitado, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        label={`Correo electrónico ${index + 1}`}
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                        value={invitado.correo}
                                        onChange={(e) => handleCorreoChange(index, 'correo', e.target.value)}
                                        disabled
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={invitado.iscamarografo} disabled />}
                                        label="¿Es fotógrafo?"
                                    />
                                    <Button variant="contained" color="error" onClick={() => handleEliminarInvitacion(invitado.idevento, invitado.idusuario, invitado.correo)}>
                                        X
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button variant="contained" color="warning" style={{ marginTop: 16 }} onClick={handleCloseVerInv}>
                            Cerrar
                        </Button>
                    </div>
                </div>
            )}
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

export default Evento;

