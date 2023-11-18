import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardActions, IconButton, Button, Snackbar } from '@mui/material';
import {
  IconShoppingCart
} from '@tabler/icons';
import { FileUploadOutlined } from '@mui/icons-material';

import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useParams } from 'react-router-dom';
import api from 'src/axiosInstance';


const Fotos = () => {
  const { idgaleria } = useParams();
  const [fotos, setFotos] = useState([]);
  const [selectedFileSearch, setSelectedFileSearch] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    obtenerFotos();
  }, []);
  const obtenerFotos = async () => {
    try {
      const response = await api.get(`/galeria/${idgaleria}`);
      console.log(response.data)
      setFotos(response.data);
    } catch (error) {
      console.error('Error al obtener eventos:', error);
    }
  };
  const handleFileChange = (event) => {
    const file = (event && event.target && event.target.files) ? event.target.files[0] : null;
    if (file) {
      setSelectedFileSearch(file);
      buscarFotoGaleria();
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
                  {foto.precio}Bs
                  <IconButton aria-label="add to favorites">
                    <IconShoppingCart />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
        </div>
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