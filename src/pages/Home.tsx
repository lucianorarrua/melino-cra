import React from 'react';
import {
  Box,
  Container,
  Link,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useSession } from '../hooks/useSession';
import { useAuthorizedFetch } from '../hooks/useAuthorizedFetch';
import { UserAddress } from '../models/meli/userAddress';
import Parse from 'parse';
import { WelcomeModal } from '../components/WelcomeModal';
import { updateNeighbour } from '../api/back4App';
import { Address } from '../models/melino/address';
import { Neighbour } from '../models/melino/neighbour';

interface Props {}

export const Home = (props: Props) => {
  const [savedAddresses, setSavedAddresses] = React.useState<UserAddress[]>([]);
  const { sessionState } = useSession();
  const { get, MELI_ENDPOINTS } = useAuthorizedFetch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  /* Si hay un usuario llama al Init */
  React.useEffect(() => {
    if (
      sessionState.meliUser &&
      sessionState.neighbour &&
      !sessionState.neighbour.importAddresses
    ) {
      init();
    }
  }, [sessionState.meliUser?.id, sessionState.neighbour]);

  /**
   * Si es usuario nuevo abre el modal de direcciones
   */
  async function init() {
    const addresses = await get<UserAddress[]>(
      `${MELI_ENDPOINTS.users.me.addresses.URL}`
    );
    setSavedAddresses(addresses);
    onOpen();
  }

  const closeModalHandler = (selectedAddressIds: number[]) => {
    onClose();
    if (sessionState.neighbour && sessionState.neighbour?.objectId) {
      const selectedUserAddress = savedAddresses.filter((a) =>
        selectedAddressIds.includes(a.id)
      );
      const newMelinoAddresses: Address[] = selectedUserAddress.map((ma) => ({
        geolocation: new Parse.GeoPoint({
          latitude: ma.latitude,
          longitude: ma.longitude,
        }),
        meli_id: ma.id,
        name: `${ma.street_name} ${ma.street_number} ${ma.city.name} (${ma.zip_code})`,
      }));
      let newNeighbour: Neighbour = {
        ...sessionState.neighbour,
        addresses: [...sessionState.neighbour.addresses!, ...newMelinoAddresses],
        importAddresses: true,
      };
      updateNeighbour(newNeighbour)
        .then((_) =>
          toast({
            title: 'Perfecto',
            description: 'Ya puedes comenzar a utilizar Melino 😁',
            status: 'success',
            duration: 2500,
            isClosable: true,
          })
        )
        .catch((_) =>
          toast({
            title: 'Algo salió mal ',
            description: 'No pudimos importar sus datos desde Mercadolibre 😓',
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        );
    }
  };

  return (
    <>
      <WelcomeModal
        isOpen={isOpen}
        onClose={closeModalHandler}
        savedAddresses={savedAddresses}
      />
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
