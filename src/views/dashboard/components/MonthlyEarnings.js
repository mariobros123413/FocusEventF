import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Stack, Typography, Fab } from '@mui/material';
import { IconCurrencyDollar } from '@tabler/icons';
import DashboardCard from '../../../components/shared/DashboardCard';
import api from 'src/axiosInstance';
const MonthlyEarnings = () => {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [precios, setPrecios] = useState([]);
  const [monthlyEarningsData, setmonthlyEarningsData] = useState([]);
  const localData = window.localStorage.getItem('loggedFocusEvent');
  const localDataParsed = localData ? JSON.parse(localData) : null;
  const userData = localDataParsed ? JSON.parse(localDataParsed.userData) : null;
  const isLoggedIn = userData !== null;
  const isUserType1 = isLoggedIn && userData.idtipousuario === 1;
  useEffect(() => {
    const fetchTotalEarnings = async () => {
      try {
        const response = await api.get(`/carrito/pedidosVendedor/${userData.id}`);
        const ventas = response.data;
        // Calcular la suma total de los precios
        const total = ventas.reduce((acc, venta) => {
          const fotosPedido = parseFotosPedido(venta.fotos_pedido);
          setPrecios(parseFloat(fotosPedido))
          return acc + parseFloat(fotosPedido);
        }, 0);
        const monthlyEarningsDatas = ventas.reduce((monthlyData, venta) => {
          const fotosPedido = parseFotosPedido(venta.fotos_pedido);

          // Verificar si penultimoValor es un número válido antes de agregarlo al objeto
          if (!isNaN(fotosPedido)) {
            const fechaVenta = new Date(venta.fecha);
            const monthYear = `${fechaVenta.getMonth() + 1}/${fechaVenta.getFullYear()}`;

            // Agregar el valor al objeto, creándolo si no existe
            if (!monthlyData[monthYear]) {
              monthlyData[monthYear] = 0;
            }

            monthlyData[monthYear] += parseFloat(fotosPedido);
          }

          return monthlyData;
        }, {});
        console.log(`monthlyEarningsDatas : ${JSON.stringify(monthlyEarningsDatas)}`)
        setmonthlyEarningsData(monthlyEarningsDatas);
        setTotalEarnings(total);
      } catch (error) {
        console.error('Error al obtener datos de ventas:', error);
      }
    };

    fetchTotalEarnings();
  }, [userData.id]);


  const parseFotosPedido = (fotosPedido) => {
    try {
      // Extraer el contenido dentro de las llaves y eliminar comillas adicionales
      const match = fotosPedido.match(/\{([^}]+)\}/);
      if (!match) {
        return [];
      }

      const cleanedString = match[1].replace(/\\"/g, '"');
      // Parsear el string resultante
      const parsedArray = cleanedString.split(',').map(item => item.trim());

      // Obtener el penúltimo valor del array
      const penultimoValor = parsedArray[parsedArray.length - 2];
      // console.log(`parsedArray : ${parsedArray}`)

      return penultimoValor;
    } catch (error) {
      console.error('Error al parsear fotos_pedido:', error);
      return [];
    }
  };

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: true,
      },
      height: 10,
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      style: {
        zIndex: 1000, // Ajusta este valor según sea necesario
        position: 'top',
      },
    },
  };
  const seriescolumnchart = [
    {
      name: '',
      data: Object.values(monthlyEarningsData), // Usar solo los valores
    },
  ];


  return (
    <DashboardCard
      title="Total de ventas"
      action={
        <Fab color="secondary" size="medium" sx={{ color: '#ffffff' }}>
          <IconCurrencyDollar width={24} />
        </Fab>
      }
      footer={
        <Chart
          options={optionscolumnchart}
          series={seriescolumnchart}
          type="area"
          height="200px"
        />
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          {`$${totalEarnings}`}
        </Typography>
        <Stack direction="row" spacing={1} my={1} alignItems="center">
          {/* Otro contenido si es necesario */}
        </Stack>
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;