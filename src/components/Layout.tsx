import { Box } from '@chakra-ui/react';
import React from 'react';
import { useSession } from '../hooks/useSession';
import { Header } from './Header';

interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sessionState, logout } = useSession();
  return (
    <>
      <Header
        loggedUser={sessionState.meliUser}
        loading={!sessionState.initValues}
        exitClickHandler={logout}
      ></Header>
      <Box as={'main'} bgColor={'gray.meli'}>
        {children}
      </Box>
    </>
  );
};
