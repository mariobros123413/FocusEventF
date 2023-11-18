import {
  IconAperture, IconCopy, IconLayoutDashboard, IconLogin, IconMoodHappy, IconTypography, IconUserPlus, IconLogout, IconCalendarEvent
} from '@tabler/icons';

import { uniqueId } from 'lodash';
const localData = window.localStorage.getItem('loggedFocusEvent');
const isLoggedIn = localData !== null; // Verifica si el usuario ha iniciado sesión

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
  {
    id: uniqueId(),
    title: 'Tus Eventos',
    icon: IconCalendarEvent,
    href: '/evento',
  },
  {
    id: uniqueId(),
    title: 'Tus Asistencias',
    icon: IconMoodHappy,
    href: '/asistencia',
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
];
export default Menuitems;
