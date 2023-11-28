import React, { useState, useEffect } from 'react';
import { Card, Divider, CardMedia, Tooltip, CardContent, CardActions, IconButton, Button, Box, Rating, TextField, Snackbar, Typography, CardHeader, Dialog, DialogContent, DialogTitle } from '@mui/material';
import {
  IconShoppingCart
} from '@tabler/icons';
import { FileUploadOutlined } from '@mui/icons-material';

import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useParams } from 'react-router-dom';
import api from 'src/axiosInstance';
import { useNavigate } from 'react-router-dom';


const Fotos = () => {
  const { idgaleria } = useParams();
  const [fotos, setFotos] = useState([]);
  const [selectedFileSearch, setSelectedFileSearch] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [resenas, setResenas] = useState([]);
  const [valoracion, setValoracion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [fotografo, setFotgrafo] = useState();
  const localData = window.localStorage.getItem('loggedFocusEvent');
  const localDataParsed = JSON.parse(localData);
  const userData = JSON.parse(localDataParsed.userData);
  useEffect(() => {
    obtenerFotos();
    window.addEventListener('keydown', handleKeyDown);

    // Configurar un intervalo que limpie el portapapeles cada 2 segundos
    setInterval(async () => {
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
    // // Limpiar el event listener y detener el intervalo al desmontar el componente
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // clearInterval(clipboardClearInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  // function handleWindowBlur() {
  //   // Redirigir a "/evento" si el usuario no está enfocado en tu aplicación
  //   navigate('/evento');
  // }

  function handleVisibilityChange() {
    // Verificar si la página está oculta (no enfocada)
    if (document.hidden) {
      // Redirigir a "/evento" si el usuario no está operando en tu aplicación
      navigate('/evento');
    }
  }

  const handleKeyDown = (event) => {
    // console.log(`event : ${event.key}`)
    // Evitar captura de pantalla con combinación de teclas (por ejemplo, Ctrl + Shift + I)
    if (event.metaKey || event.key === 'PrintScreen' || event.keyCode === 123) {
      event.preventDefault();
      setSnackbarMessage('Captura de pantalla deshabilitada');
      setSnackbarOpen(true);
      navigate('/evento');
    }
  };

  const handleOpenModal = async (idfotografo) => {
    getResenas(idfotografo);
    setModalOpen(true);
    // Aquí puedes agregar la lógica para cargar las reseñas del fotógrafo
  };
  const getResenas = async (idfotografo) => {
    const response = await api.get(`/usuario/resenas/${idfotografo}`);
    setResenas(response.data);
    setFotgrafo(idfotografo);
  }
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleEnviarValoracion = async () => {
    try {
      await api.post(`/usuario/resenas/${fotografo}`, {
        "comentario": comentario,
        "valoracion": valoracion,
        "idusuario": userData.id
      })
      setSnackbarMessage('Valoración enviada');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Ocurrió un error inesperado');
      setSnackbarOpen(true);
    }
    getResenas(fotografo);
    // También puedes reiniciar los estados de valoración y comentario si es necesario
    setValoracion(0);
    setComentario('');
  };
  const obtenerFotos = async () => {
    try {
      const response = await api.get(`/galeria/${idgaleria}`);
      console.log(response.data)
      const fotosConMarcaAgua = await Promise.all(
        response.data.map(async (foto) => {
          try {
            const response = await api.get(`/carrito/image?imageUrl=${foto.url}`, { responseType: 'arraybuffer' });
            const blob = new Blob([response.data], { type: 'image/jpeg' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            // Obtener la imagen con marca de agua usando la función agregarMarcaDeAgua
            const imageUrlWithWatermark = await agregarMarcaDeAgua(downloadLink, 'FOCUS EVENT');

            // Retornar el objeto de la foto con la nueva URL
            return { ...foto, url: imageUrlWithWatermark };
          } catch (error) {
            console.error('Error al agregar marca de agua:', error);
            // En caso de error, simplemente retornar la foto sin modificar
            return foto;
          }
        })
      );
      setFotos(fotosConMarcaAgua);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
    }
  };
  const agregarMarcaDeAgua = async (imageUrl, watermarkText) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Establecer el tamaño del canvas según el tamaño de la imagen
        canvas.width = image.width;
        canvas.height = image.height;

        // Dibujar la imagen en el canvas
        context.drawImage(image, 0, 0);

        // Inicializar el tamaño de la fuente
        let fontSize = 30; // Tamaño de fuente inicial
        let textFits = false;

        while (!textFits && fontSize > 0) {
          // Establecer el estilo de la marca de agua con el tamaño de fuente actual
          context.font = `${fontSize}px Arial`;
          context.fillStyle = 'rgba(93,135,255)'; // Color blanco con opacidad
          context.textAlign = 'center';
          context.textBaseline = 'middle';

          // Calcular la posición para centrar el texto verticalmente
          const x = canvas.width / 2;
          const y = canvas.height / 2;

          // Dibujar el texto como marca de agua
          context.fillText(watermarkText, x, y);

          // Verificar si el texto cabe completamente en la imagen
          textFits = y + fontSize / 2 < canvas.height;

          // Reducir el tamaño de la fuente si es necesario
          if (!textFits) {
            fontSize--;
          }
        }

        // Obtener la URL de la imagen con marca de agua
        const fotoConMarcaAgua = canvas.toDataURL('image/jpeg');
        resolve(fotoConMarcaAgua);
      };

      // Cargar la imagen
      image.src = imageUrl;
    });
  };

  const handleFileChange = (event) => {
    const file = (event && event.target && event.target.files) ? event.target.files[0] : null;
    if (file) {
      setSelectedFileSearch(file);
      buscarFotoGaleria();
    }
  };

  const handleAddFoto = async (idfoto, precio, idfotografo, url) => {
    try {
      const response = await api.post(`/carrito/agregarFoto/${userData.id}`, {
        "idfoto": idfoto,
        "idfotografo": idfotografo,
        "precio": precio,
        "url": url
      });
      // eslint-disable-next-line no-template-curly-in-string
      if (response.data === "Ya existe un carrito con el par asociado : idfoto= ${idfoto}, idusuario= ${idusuario}") {
        setSnackbarMessage('Esta foto ya está en el carrito');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Foto agregada al carrito');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };

  const buscarFotoGaleria = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('foto', selectedFileSearch);

      let response;
      // Esperar 10 segundos para obtener la respuesta de la API
      await Promise.race([
        api.post(`galeria/buscarPersonaFoto/${idgaleria}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
      ])
        .then((res) => {
          response = res;
        })
        .catch((error) => {
          console.log(`Timeout error: ${error}`);
          throw new Error('La solicitud tardó demasiado en responder.');
        });

      if (response.data.length === 0) {
        setSnackbarMessage('No se encontraron fotos');
        setSnackbarOpen(true);
      }

      // Esperar 5 segundos adicionales antes de actualizar el estado y mostrar el resultado
      await new Promise(resolve => setTimeout(resolve, 5000));

      setFotos(response.data);
    } catch (error) {
      console.log(`error : ${error}`);
      setSnackbarMessage('Error al buscar, prueba con otra imagen');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };


  return (


    <PageContainer title="Fotos" description="Tus fotos">

      <DashboardCard title="Fotos de tu evento">
        {Array.isArray(fotos) && fotos.length > 0 ? (

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
            disabled={loading} // Deshabilita el botón mientras se carga

          >
            ¡Buscar tus fotografías!
            <input
              id="file-input"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Button>
        ) : (
          <CardContent>
            <Typography variant="h6" color="text.primary">
              Aún no hay fotos en el evento..
            </Typography>
          </CardContent>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>

          {fotos.filter((foto) => foto.usuariomostrar).sort((a, b) => a.id - b.id)
            .map((foto) => (
              <Card key={foto.id} sx={{ width: '30%', margin: '15px' }}>
                <CardHeader
                  title="Correo del fotógrafo:"
                  subheader={foto.correo}
                  onClick={() => { handleOpenModal(foto.idfotografo) }}
                  sx={{ cursor: 'pointer' }} // Cambia el cursor a una mano al pasar el mouse
                >
                  <Tooltip title="Ver reseñas" arrow>
                    <span style={{ cursor: 'pointer' }}>Ver reseñas</span>
                  </Tooltip>
                </CardHeader>

                <CardMedia
                  component="img"
                  height="50%"
                  style={{ objectFit: 'contain' }}
                  image={foto.urlwm}
                  alt="Paella dish"
                />
                <CardActions disableSpacing>
                  {foto.precio}Bs
                  <IconButton aria-label="add to favorites" style={{ paddingLeft: '35%' }} onClick={() => handleAddFoto(foto.id, foto.precio, foto.idfotografo, foto.url)}>
                    <Typography>Agregar al carrito</Typography>
                    <IconShoppingCart />
                  </IconButton >
                </CardActions>
              </Card>
            ))}
        </div>
        <Dialog open={modalOpen} onClose={handleCloseModal} aria-labelledby="draggable-dialog-title">
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            Reseñas del Fotógrafo/Empresa
          </DialogTitle>
          <DialogContent>
            <div>
              {/* Puedes mostrar las reseñas aquí */}
              {resenas.map((resena) => (
                <div key={resena.id}>
                  <Typography>Valoración:</Typography>
                  <Rating
                    name="read-only"
                    value={parseInt(resena.valoracion)}
                    readOnly
                  />
                  <Typography>Comentario: {resena.comentario}</Typography>
                  <Divider sx={{ marginY: 2 }} />
                </div>
              ))}
            </div>
          </DialogContent>
          <DialogContent>
            <Box>
              <Typography>Deja tu valoración:</Typography>
              <Rating
                name="valoracion"
                value={valoracion}
                onChange={(event, newValue) => setValoracion(newValue)}
              />
              <TextField
                label="Comentario"
                multiline
                rows={4}
                value={comentario}
                onChange={(event) => setComentario(event.target.value)}
              />
            </Box>
          </DialogContent>
          <CardActions>
            <Button onClick={handleEnviarValoracion} color="primary">
              Enviar Valoración
            </Button>
            <Button onClick={handleCloseModal} color="primary">
              Cerrar
            </Button>
          </CardActions>
        </Dialog>

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

export default Fotos; 