import { useToast } from '@chakra-ui/toast';
import React from 'react';
import { Redirect, useLocation } from 'react-router';
import { useSession } from '../hooks/useSession';

export const MeliAuthorization = () => {
  const toast = useToast();
  const { getTokenAndSave, getUserTokenAndSave } = useSession();
  const urlParams = new URLSearchParams(useLocation().search);
  const meliCode = urlParams.get('code');
  if (meliCode) {
    getTokenAndSave(meliCode).then((t) => t && getUserTokenAndSave(t));
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
