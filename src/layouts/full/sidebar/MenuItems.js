import {
  IconAperture, IconCopy, IconLayoutDashboard, IconBrandCashapp, IconLogin, IconGift, IconMoodHappy, IconTypography, IconUserPlus, IconLogout, IconCalendarEvent, IconShoppingCart
} from '@tabler/icons';

import { uniqueId } from 'lodash';
const localData = window.localStorage.getItem('loggedFocusEvent');
const localDataParsed = localData ? JSON.parse(localData) : null;
const userData = localDataParsed ? JSON.parse(localDataParsed.userData) : null;
const isLoggedIn = userData !== null;

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },

  {
    id: uniqueId(),
    title: 'Inicio',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },
  {
    navlabel: true,
    subheader: 'Utilidades',
  },
  isLoggedIn && userData.idtipousuario !== 2 && {
    id: uniqueId(),
    title: 'Tus Eventos',
    icon: IconCalendarEvent,
    href: '/evento',
  },
  isLoggedIn && {
    id: uniqueId(),
    title: 'Tus Asistencias',
    icon: IconMoodHappy,
    href: '/asistencia',
  },
  isLoggedIn && {
    id: uniqueId(),
    title: 'Tu Carrito',
    icon: IconShoppingCart,
    href: '/carrito',
  },
  isLoggedIn && {
    id: uniqueId(),
    title: 'Tus compras',
    icon: IconGift,
    href: '/compras',
  },
  isLoggedIn && userData.idtipousuario === 1 && {
    id: uniqueId(),
    title: 'Tus Ventas',
    icon: IconBrandCashapp,
    href: '/pedidos',
  },
  {
    id: uniqueId(),
    title: 'Typography',
    icon: IconTypography,
    href: '/ui/typography',
  },
  {
    id: uniqueId(),
    title: 'Shadow',
    icon: IconCopy,
    href: '/ui/shadow',
  },
  {
    navlabel: true,
    subheader: 'Autenticación',
  },
  !isLoggedIn && {
    id: uniqueId(),
    title: 'Inicio de Sesión',
    icon: IconLogin,
    href: '/auth/login',
  },
  !isLoggedIn && {
    id: uniqueId(),
    title: 'Registro',
    icon: IconUserPlus,
    href: '/auth/register',
  },
  {
    id: uniqueId(),
    title: 'Cerrar Sesión',
    icon: IconLogout,
    href: '/',
  },
  {
    navlabel: true,
    subheader: 'Extra',
  },
  {
    id: uniqueId(),
    title: 'Icons',
    icon: IconMoodHappy,
    href: '/icons',
  },
  {
    id: uniqueId(),
    title: 'Sample Page',
    icon: IconAperture,
    href: '/sample-page',
  },
].filter(Boolean);
export default Menuitems;
