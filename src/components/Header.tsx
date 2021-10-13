import React from 'react';
import { Box, Container, Flex, Image, Link, Text } from '@chakra-ui/react';
import { User } from '../models/meli/user';

interface HeaderProps {
  loggedUser: User | null;
  loading?: boolean;
  exitClickHandler?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  loggedUser,
  loading = false,
  exitClickHandler,
}) => {
  return (
    <Box as={'header'} bgColor={'meli.300'}>
      <Container maxW='container.md'>
        <Flex
          h={'3.5rem'}
          w={'full'}
          direction={'row'}
          justifyContent={'space-between'}
        >
          <Box as={'a'} h={'100%'} w={'auto'} href='/'>
            <Image
              m={'2.5px'}
              h={'100%'}
              src={`${process.env.PUBLIC_URL}/logo512.png`}
            />
          </Box>
          {!loading && (
            <Flex as={'nav'} alignItems={'flex-end'}>
              {!loggedUser && (
                <Link
                  as={'a'}
                  href={`https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${process.env.REACT_APP_MELI_CLIENT_ID}`}
                >
                  Ingresá
                </Link>
              )}
              {loggedUser && (
                <Flex as={'nav'}>
                  <Text mr={6}>¡Hola, {loggedUser.nickname}!</Text>
                  <Link as={'a'} onClick={exitClickHandler}>
                    Salir
                  </Link>
                </Flex>
              )}
            </Flex>
          )}
        </Flex>
      </Container>
    </Box>
  );
};
