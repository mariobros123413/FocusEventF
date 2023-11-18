import React, { useEffect, useState } from 'react';
import api from 'src/axiosInstance';
import { useNavigate } from 'react-router-dom';

import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Button,
    Stack,
    Checkbox
} from '@mui/material';
import { Link } from 'react-router-dom';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';

const AuthLogin = ({ title, subtitle, subtext }) => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [, setUser] = useState(null);
    const [, setToken] = useState(null);

    useEffect(() => {
        const loggedJSON = window.localStorage.getItem('loggedFocusEvent');
        if (loggedJSON) {
            const user = JSON.parse(loggedJSON);
            setUser(user);
        }
    }, [])
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = async () => {
        try {
            const response = await api.post('/usuario/login', {
                correo: email,
                password: password,
            });

            const userData = JSON.stringify(response.data.user);
            const token = JSON.stringify(response.data.token);
            // Almacena la información del usuario en el estado local
            window.localStorage.setItem('loggedFocusEvent', JSON.stringify({ userData, token }));
            setUser(userData);
            setToken(token);
            // Aquí puedes redirigir a la página de inicio o hacer otras operaciones después del inicio de sesión exitoso
            navigate('/dashboard');
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
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

            <Stack>
                <Box>
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='username' mb="5px">Correo electrónico</Typography>
                    <CustomTextField id="username" variant="outlined" fullWidth value={email} onChange={handleEmailChange} />
                </Box>
                <Box mt="25px">
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='password' mb="5px" >Contraseña</Typography>
                    <CustomTextField id="password" type="password" variant="outlined" fullWidth value={password} onChange={handlePasswordChange} />
                </Box>
                <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="Remeber this Device"
                        />
                    </FormGroup>
                    <Typography
                        component={Link}
                        to="/"
                        fontWeight="500"
                        sx={{
                            textDecoration: 'none',
                            color: 'primary.main',
                        }}
                    >
                        ¿Olvidaste tu Contraseña?
                    </Typography>
                </Stack>
            </Stack>
            <Box>
                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    type="submit"
                    onClick={handleLogin}
                >
                    Iniciar Sesión
                </Button>
            </Box>
            {subtitle}
        </>
    );
};

export default AuthLogin;
