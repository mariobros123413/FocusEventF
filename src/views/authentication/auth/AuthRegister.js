import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import api from 'src/axiosInstance';
import { useNavigate } from 'react-router-dom';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';

const AuthRegister = ({ title, subtitle, subtext }) => {
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [direccion, setDireccion] = useState('');
    const [, setUser] = useState(null);
    const [, setToken] = useState(null);

    const handleNombreChange = (event) => {
        setNombre(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleDireccionChange = (event) => {
        setDireccion(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRegister = async () => {
        try {
            const response = await api.post('/usuario/register', {
                nombre: nombre,
                correo: email,
                password: password,
                direccion: direccion,
                idtipousuario: 2, //usuario normal
            });

            const userData = JSON.stringify(response.data.usuario);
            const token = JSON.stringify(response.data.token);
            // Almacena la información del usuario en el estado local
            setUser(userData);
            setToken(token);

            window.localStorage.setItem('loggedFocusEvent', JSON.stringify({ userData, token }));
            navigate('/dashboard');
        } catch (error) {
            console.error('Error al registrarse:', error);
        }
    };

    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <Box>
                <Stack mb={3}>
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='name' mb="5px">Nombre Completo</Typography>
                    <CustomTextField id="name" variant="outlined" fullWidth value={nombre} onChange={handleNombreChange} />

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='email' mb="5px" mt="25px">Correo electrónico</Typography>
                    <CustomTextField id="email" variant="outlined" fullWidth value={email} onChange={handleEmailChange} />

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='direccion' mb="5px" mt="25px">Dirección de domicilio</Typography>
                    <CustomTextField id="direccion" variant="outlined" fullWidth value={direccion} onChange={handleDireccionChange} />

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='password' mb="5px" mt="25px">Contraseña</Typography>
                    <CustomTextField id="password" type="password" variant="outlined" fullWidth value={password} onChange={handlePasswordChange} />
                </Stack>
                <Button color="primary" variant="contained" size="large" fullWidth type="submit" onClick={handleRegister}>
                    Registrarse
                </Button>
            </Box>
            {subtitle}
        </>
    );
};

export default AuthRegister;
