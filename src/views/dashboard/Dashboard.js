import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

// components
import SalesOverview from './components/SalesOverview';
import MonthlyEarnings from './components/MonthlyEarnings';


const Dashboard = () => {
  const localData = window.localStorage.getItem('loggedFocusEvent');
  if (localData === null) {
    return (
      <PageContainer title="Bienvenido a nuestro Dashboard" description="Bienvenido a nuestro servicio">
        <Box>
          <Typography variant="h5">
            ¡Bienvenido! Inicia Sesión y disfruta de tus eventos!.
          </Typography>
          {/* Puedes agregar más contenido o enlaces de registro aquí */}
        </Box>
      </PageContainer>
    );
  }
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={8}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
