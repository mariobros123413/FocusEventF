import React, { useState, useEffect } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { Typography, Button, TextField, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogContentText, Snackbar } from '@mui/material';
import api from 'src/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Asistencia = () => {
  const navigate = useNavigate();

  const localData = window.localStorage.getItem('loggedFocusEvent');
  const localDataParsed = JSON.parse(localData);
  const userData = JSON.parse(localDataParsed.userData);
  const [asistencias, setAsistencias] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const handleClose = () => setOpen(false);
  const handleOpenCreate = () => setOpen(true);
  const [codigo, setCodigo] = useState('');
  const [openElim, setOpenElim] = useState(false);
  const handleCloseElim = () => setOpenElim(false);
  const handleActualizarCuenta = async () => {
    try {
      // Usa el id del evento almacenado para hacer la solicitud de eliminación
      // await api.delete(`/evento/eliminarEvento/${eventoAEliminar}`);
      setOpenElim(false); // Cierra el diálogo después de eliminar con éxito
      obtenerAsistencias();
    } catch (error) {
      console.error('Error al eliminar evento:', error);
    }
  };
  const handleCodigoChange = (event) => {
    setCodigo(event.target.value);
  };
  useEffect(() => {
    obtenerAsistencias();
  }, []);
  const obtenerAsistencias = async () => {
    try {
      const response = await api.get(`/evento/getAsistencias/${userData.id}`);
      console.log('Asistencias antes del filtro:', asistencias);

      setAsistencias(response.data);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
    }
  };
  const handleNavigateFotos = async (idevento, idgaleria) => {
    try {
      navigate(`/evento/${idevento}/${idgaleria}/fotos`);
      obtenerAsistencias();
    } catch (error) {
      // Manejar errores, por ejemplo, mostrar un mensaje al usuario
      console.error('Error al crear la reunión:', error);
    }
  };
  const handleNavigateAddFotos = async (nombre, idgaleria) => {
    if (userData.idtipousuario === 1) {
      try {
        navigate(`/asistencia/${nombre}/${idgaleria}`);
        obtenerAsistencias();
      } catch (error) {
        // Manejar errores, por ejemplo, mostrar un mensaje al usuario
        console.error('Error al crear la reunión:', error);
      }
    } else {
      setOpenElim(true);
    }

  };
  const handleCreateAsistencia = async () => {
    if (!codigo) {
      // Si algún campo está vacío, muestra un Snackbar de error
      setSnackbarMessage('Todos los campos son obligatorios');
      setSnackbarOpen(true);
      return;
    }

    const horaActual = new Date().toLocaleTimeString();
    try {
      await api.post('/evento/ingresarEvento', {
        codigo: codigo,
        horallegada: horaActual,
        idusuario: userData.id,
        iscamarografo: userData.iscamarografo,
      });

      // Si la solicitud fue exitosa, mostrar un mensaje de éxito
      setSnackbarMessage('Has ingresado al evento');
      setSnackbarOpen(true);

      // Cerrar el modal y actualizar las asistencias
      setOpen(false);
      obtenerAsistencias();
    } catch (error) {
      // Si hay un error, mostrar un mensaje de error
      setSnackbarMessage('Error al unirse al evento, necesita estar invitado');
      setSnackbarOpen(true);
    }
  };

  return (
    <PageContainer title="Asistencias" description="recuerda tus asistencias">

      <DashboardCard title="Tus Asistencias a Eventos">
        <Button color="primary" variant="contained" size="large" onClick={handleOpenCreate}>
          Registrar Asistencia +
        </Button>
        {/* Bucle para mostrar tarjetas de eventos */}
        {asistencias.filter((asistencia) => asistencia.horallegada !== null).map((asistencia) => (
          <Card key={asistencia.id} style={{ marginTop: '16px' }} >
            <CardContent>
              <Typography variant="h5" component="div">
                {asistencia.nombre}
              </Typography>
              <Typography color="textSecondary">
                Fecha : {asistencia.fecha}
              </Typography>
              <Typography color="textSecondary">
                Hora de tu llegada : {asistencia.horallegada}
              </Typography>
              {/* Puedes agregar más detalles del evento aquí */}
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleNavigateFotos(asistencia.idevento, asistencia.idgaleria)}>
                Ver fotos
              </Button>
              {asistencia.iscamarografo && (
                <Button size="small" onClick={() => handleNavigateAddFotos(asistencia.nombre, asistencia.idgaleria)}>
                  Añadir fotos
                </Button>
              )}
            </CardActions>
          </Card>
        ))}
      </DashboardCard>
      {open && (
        <div className="modal-background">
          <div className="modal-content">
            <Typography variant="h5" gutterBottom>
              Registrar tu asistencia a un evento
            </Typography>
            <TextField
              label="Código proporcionado en el evento"
              fullWidth
              variant="outlined"
              margin="normal"
              value={codigo}
              onChange={handleCodigoChange}
            />
            <Button variant="contained" color="primary" onClick={handleCreateAsistencia} style={{ marginTop: 16 }}>
              Unirse al Evento
            </Button>
            <Button variant="contained" color="warning" onClick={handleClose} style={{ marginTop: 16, marginLeft: 20 }}>
              Cancelar
            </Button>

          </div>
        </div>
      )}
      {openElim && (
        <Dialog open={openElim} onClose={handleCloseElim} aria-labelledby="draggable-dialog-title">
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            Actualiza tu Cuenta a Fotógrafo!!
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Necesitas actualizar tu cuenta a Fotógrafo para poder subir fotos y empezar con tu negocio de Fotógrafo en nuestra página.
            </DialogContentText>
          </DialogContent>
          <CardActions>
            <Button autoFocus onClick={handleCloseElim} color="primary">
              Cerrar
            </Button>
            <Button onClick={handleActualizarCuenta} color="primary">
              Actualízate
            </Button>
          </CardActions>
        </Dialog>
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

export default Asistencia;