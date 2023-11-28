import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')))
const Home = Loadable(lazy(() => import('../views/dashboard/Home')))
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')))
const Icons = Loadable(lazy(() => import('../views/icons/Icons')))
const TypographyPage = Loadable(lazy(() => import('../views/utilities/TypographyPage')))
const Shadow = Loadable(lazy(() => import('../views/utilities/Shadow')))
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const Evento = Loadable(lazy(() => import('../views/events/Evento')));
const Fotos = Loadable(lazy(() => import('../views/photos/Fotos')));
const Asistencia = Loadable(lazy(() => import('../views/assist/Asistencia')));
const SubirFotos = Loadable(lazy(() => import('../views/photos/SubirFotos')));
const Cart = Loadable(lazy(() => import('../views/cart/Carrito')));
const Compras = Loadable(lazy(() => import('../views/cart/Compras')));
const Pedido = Loadable(lazy(() => import('../views/order/Pedido')));
const Suscripcion = Loadable(lazy(() => import('../views/suscription/Suscripcion')));
const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: '/dashboard', exact: true, element: <Dashboard /> },
      { path: '/sample-page', exact: true, element: <SamplePage /> },
      { path: '/icons', exact: true, element: <Icons /> },
      { path: '/ui/typography', exact: true, element: <TypographyPage /> },
      { path: '/ui/shadow', exact: true, element: <Shadow /> },
      { path: '/evento', exact: true, element: <Evento /> },
      { path: '/asistencia', exact: true, element: <Asistencia /> },////////
      { path: '/asistencia/:nombre/:idgaleria', exact: true, element: <SubirFotos /> },
      { path: '/evento/:idevento/:idgaleria/fotos', exact: true, element: <Fotos /> },
      { path: '/carrito', exact: true, element: <Cart /> },
      { path: '/compras', exact: true, element: <Compras /> },
      { path: '/pedidos', exact: true, element: <Pedido /> },
      { path: '/suscripcion', element: <Suscripcion /> },
      { path: '*', element: <Navigate to="/suscripcion" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/login', element: <Login /> },
      { path: '*', element: <Navigate to="/suscripcion" /> },
    ],
  },
  {
    path: '/home',
    element: <BlankLayout />,
    children: [
      { path: '/home', element: <Home /> },
      { path: '*', element: <Navigate to="/suscripcion" /> },
    ],
  }
];

export default Router;
