/* eslint-disable array-callback-return */
import React from 'react';
import Menuitems from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List } from '@mui/material';
import NavItem from './NavItem';
import NavGroup from './NavGroup/NavGroup';

const SidebarItems = () => {
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const localData = window.localStorage.getItem('loggedFocusEvent');
  const isLoggedIn = localData !== null;

  const handleLogout = () => {
    // Procedimiento para cerrar sesión, por ejemplo, limpiar localStorage
    window.localStorage.removeItem('loggedFocusEvent');
    // Redirigir al usuario a la página principal
  };
  
  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {Menuitems.map((item) => {
          // {/********SubHeader**********/}
          if (item.subheader) {
            return <NavGroup item={item} key={item.subheader} />;

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } else if (item) {
            if (item.title === 'Cerrar Sesión' && isLoggedIn) {
              return (
                <NavItem item={item} key={item.id} pathDirect={pathDirect} onClick={handleLogout}/>
              );
            }
            else if(item.title !== 'Cerrar Sesión' ) {
              return (
                <NavItem item={item} key={item.id} pathDirect={pathDirect} />
              );
            }
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
