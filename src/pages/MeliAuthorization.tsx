import { useToast } from '@chakra-ui/toast';
import React from 'react';
import { Redirect, useLocation } from 'react-router';
import { useStorage } from '../hooks/useStorage';


export const MeliAuthorization = () => {
  const { KEYS, save } = useStorage();
  const toast = useToast();
  const urlParams = new URLSearchParams(useLocation().search);
  const meliCode = urlParams.get('code');
  if (meliCode) {
    save(KEYS.MELI_CODE, meliCode);
  } else {
    toast({
      title: 'No se pudo ingresar',
      description: 'Ocurrió un error al autenticarse con Mercadolibre 😓',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }

  return <Redirect to='/'></Redirect>;
};
