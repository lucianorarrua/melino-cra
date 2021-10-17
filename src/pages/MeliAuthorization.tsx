import { Progress } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import React from 'react';
import { Redirect, useLocation } from 'react-router';
import { createParseObject, getNeighbourFromMeliId } from '../api/back4App';
import { useSession } from '../hooks/useSession';

export const MeliAuthorization = () => {
  const [loading, setLoading] = React.useState(true);
  const { getTokenAndSave, getUserTokenAndSave } = useSession();
  const { search } = useLocation();
  const toast = useToast();

  React.useEffect(() => {
    const asyncInit = async () => {
      const meliCode = new URLSearchParams(search).get('code');
      if (meliCode) {
        const newToken = await getTokenAndSave(meliCode);
        if (newToken) {
          const meliUser = await getUserTokenAndSave(newToken);
          if (meliUser) {
            let parseNeighbour = await getNeighbourFromMeliId(meliUser.id);
            if (!parseNeighbour) {
              await createParseObject({
                className: 'Neighbour',
                attributes: {
                  meliUserId: meliUser.id,
                  name: meliUser.first_name,
                },
              });
            }
          }
        }
      } else {
        toast({
          title: 'No se pudo ingresar',
          description: 'Ocurrió un error al autenticarse con Mercadolibre 😓',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      setLoading(false);
    };
    asyncInit();
  }, []);

  if (loading) {
    return <Progress size='lg' isIndeterminate />;
  }

  return <Redirect to='/'></Redirect>;
};
