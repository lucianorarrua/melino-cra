import { Box, Text, Image } from '@chakra-ui/react';
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
      <Box as={'main'} bgColor={'gray.meli'} flexGrow={1}>
        {children}
      </Box>
      <Box
        as={'footer'}
        bgColor={'blue.50'}
        bottom={0}
        h={'35px'}
        w={'full'}
        pt={1}
        pb={2}
        pl={6}
      >
        <Text opacity={0.5}>
          <Image
            boxSize='15px'
            src={`${process.env.PUBLIC_URL}/pixel-heart.webp`}
            alt='Segun Adebayo'
            display={'inline'}
          />{' '}
          By{' '}
          <Text
            as={'a'}
            href={'https://www.github.com/lucianorarrua'}
            target={'_blank'}
            fontWeight={'bold'}
          >
            Luciano Arrúa
          </Text>
        </Text>
      </Box>
    </>
  );
};
