import React from 'react';
import { Box, Container, Link, Text } from '@chakra-ui/react';
import { Layout } from '../components/Layout';

interface Props {}

export const Home = (props: Props) => {
  return (
    <>
      <Box w={'full'} bgColor={'meli.300'}>
        <Container maxW='container.md' pos={'relative'} pt={'30px'} pb={'60px'}>
          <Text fontSize='5xl'>¡Compartí gastos con tu vecino!</Text>
          <Text fontSize='2xl'>
            Buscá un producto de{' '}
            <Link
              fontWeight={'bold'}
              href='https://www.mercadolibre.com.ar'
              isExternal
            >
              mercadolibre.com
            </Link>{' '}
            y averiguá con quien podes compartir el envío.
          </Text>
          <Box
            w={'full'}
            as={'input'}
            p={'7px 60px 9px 15px'}
            borderRadius={'md'}
            boxShadow={'rgba(0, 0, 0, 0.2) 0px 1px 2px 0px'}
            pos='absolute'
            bottom={'-20px'}
            placeholder={'Ingresá una URL de mercadolibre.com'}
            right={0}
            left={0}
          ></Box>
        </Container>
      </Box>
      <Box as={'main'} bgColor={'gray.300'}></Box>
    </>
  );
};
