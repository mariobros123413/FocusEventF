import React, { useState, useEffect } from 'react';
import { Select, MenuItem } from '@mui/material';
import Chart from 'react-apexcharts';
import DashboardCard from '../../../components/shared/DashboardCard';
import api from 'src/axiosInstance';
const SalesOverview = () => {
    const [month, setMonth] = useState('11');
    const [meses, setMeses] = useState([]);
    const [cant, setCant] = useState([]);
    const localData = window.localStorage.getItem('loggedFocusEvent');
    const localDataParsed = localData ? JSON.parse(localData) : null;
    const userData = localDataParsed ? JSON.parse(localDataParsed.userData) : null;

    const handleChange = (event) => {
        setMonth(event.target.value);
    };

    useEffect(() => {
        // Hacer la solicitud a tu backend cuando el componente se monta o cuando 'month' cambia
        // if (!isUserType1) {
        //     return <></>;
        // }
        const fetchSalesData = async () => {
            try {
                const response = await api.get(`/carrito/pedidosVendedor/${userData.id}`);
                const ventas = response.data;
                const fechasVentas = ventas.map((venta) => {
                    const ventaDate = new Date(venta.fecha);
                    // Reformatear a 'YYYY-MM-DD'
                    return ventaDate.toISOString().split('T')[0];
                });
                const ventasPorMes = fechasVentas
                    .sort((a, b) => new Date(a) - new Date(b)) // Ordenar las fechas
                    .reduce((result, fecha) => {
                        const fechaVenta = new Date(fecha);
                        const mes = fechaVenta.getMonth() + 1; // Los meses en JavaScript son indexados desde 0
                        const yearMonth = `${fechaVenta.getFullYear()}-${mes.toString().padStart(2, '0')}`;

                        // Si el mes ya existe en el resultado, suma 1 a la cantidad; de lo contrario, crea una nueva entrada
                        if (result[yearMonth]) {
                            result[yearMonth].cantidadVentas += 1;
                        } else {
                            result[yearMonth] = {
                                mes: yearMonth,
                                cantidadVentas: 1,
                            };
                        }

                        return result;
                    }, {});

                setMeses(Object.keys(ventasPorMes).sort());
                setCant(Object.values(ventasPorMes).map((venta) => venta.cantidadVentas));
                // Filtrar las ventas por mes seleccionado
                // const ventasDelMes = ventas.filter((venta) => {
                //     const ventaDate = new Date(venta.fecha);
                //     // Reformatear a 'YYYY-MM-DD' para comparar
                //     // const fechaFormateada = ventaDate.toISOString().split('T')[0];
                //     console.log(`${new Date().getFullYear()}-${month.padStart(2, '0')}`)

                //     const fechaFormateada = `${ventaDate.getFullYear()}-${(ventaDate.getMonth() + 1).toString().padStart(2, '0')}`;
                //     const fechaComparacion = `${new Date().getFullYear()}-${month.toString().padStart(2, '0')}`;

                //     return fechaFormateada === fechaComparacion;
                // });
            } catch (error) {
                console.error('Error al obtener datos de ventas:', error);
            }
        };

        fetchSalesData();
    }, [month, userData.id]); // Dependencias 'month' y 'tuIdDeVendedorAqui' para volver a cargar los datos cuando cambian


    const optionscolumnchart = {
        xaxis: {
            categories: meses,
            axisBorder: {
                show: false,
            },
        },
    };

    const seriescolumnchart = [
        {
            name: 'Cantidad de Ventas',
            data: cant,
        },
    ];
    return (
        <DashboardCard title="Ventas Mensuales" action={
            <Select
                labelId="month-dd"
                id="month-dd"
                value={month}
                size="small"
                onChange={handleChange}
            >
                <MenuItem value={11}>Año 2023</MenuItem>
            </Select>

        }>
            <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="bar"
                height="370px"
            />
        </DashboardCard>
    );
};

export default SalesOverview;
