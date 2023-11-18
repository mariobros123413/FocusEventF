
import React from 'react';
import './homepage.css';
import { Grid, Box, Card, Stack, Typography, Button } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

const Home = () => {
    
    // const [redirectToReunion, setRedirectToReunion] = useState(false);

    // Función para manejar el envío del formulario

    return (
        <PageContainer title="FocusEvent" description="">
            <Box
                sx={{
                    position: 'relative',
                    '&:before': {
                        content: '""',
                        background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
                        backgroundSize: '400% 400%',
                        animation: 'gradient 15s ease infinite',
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        opacity: '0.3',
                    },
                }}
            >
                <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        lg={4}
                        xl={3}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '500px' }}>
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <img
                                    className="headerImg"
                                    src="https://scontent.fvvi1-1.fna.fbcdn.net/v/t1.15752-9/398308058_806063907871492_736907878499778318_n.png?_nc_cat=101&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=PsjjU9sPNUoAX_p-Tnl&_nc_ht=scontent.fvvi1-1.fna&oh=03_AdRwWHrq_FhGIgHGauc5Wyj1DsWjCuylSRreqGK-dcBSsg&oe=656CF82D"
                                    alt=""
                                    height='200'
                                />
                            </Box>
                            <Box>
                                <Stack mb={2}>
                                    <Typography variant="h1"
                                        fontWeight={600} component="label" htmlFor='name' mb="5px" align='center'>FocusEvent</Typography>
                                    <Typography variant="h3"
                                        fontWeight={600} component="label" htmlFor='name' mb="5px" align='center'>Enfócate en tu evento, nosotros capturamos el momento.</Typography>

                                </Stack>
                            </Box>
                            <Box>
                                <div style={{padding:'10px'}}>
                                    <Button color="primary" variant="contained" size="large" fullWidth type="submit" href='/auth/register'>
                                        Registrarse
                                    </Button>
                                </div>
                                <div style={{padding:'10px'}}>
                                    <Button color="primary" variant="contained" size="large" fullWidth type="submit" href='/auth/login'>
                                        Iniciar Sesión
                                    </Button>
                                </div>
                            </Box>
                        </Card>

                    </Grid>

                </Grid>
            </Box>
        </PageContainer>

    );
};

export default Home;