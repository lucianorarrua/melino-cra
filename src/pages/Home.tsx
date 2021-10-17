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
import Parse, { GeoPoint } from 'parse';
import { WelcomeModal } from '../components/WelcomeModal';
import { getNearNeighbours, updateNeighbour } from '../api/back4App';
import { Address } from '../models/melino/address';
import { Neighbour } from '../models/melino/neighbour';
import { SearchedResult, SearchInput } from '../components/SearchInput';
import { meliFetch } from '../utils/fetch';
import { Product } from '../models/meli/product';
import { useHistory } from 'react-router';
import {
  NearNeighbour,
  NearNeighbourList,
} from '../components/NearNeighbourList';

export const Home = () => {
  /**
   * savedAddresses son las direccione que la persona tiene almacenadas en mercadolibre. Se guardan en un estado para luego pasarlo al WelcomeModal la primera vez que ingresan a melino.
   */
  const [savedAddresses, setSavedAddresses] = React.useState<UserAddress[]>([]);
  /**
   * Lista de los Vecinos cercanos
   */
  const [nearNeighbours, setNearNeighbours] = React.useState<NearNeighbour[]>(
    []
  );

  const { sessionState } = useSession();
  const { get, MELI_ENDPOINTS } = useAuthorizedFetch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const history = useHistory();

  /* Al iniciar, solicita permiso para ubicación, y si se concede, agrega la ubicación a los nearNeighbours */
  React.useEffect(() => {
    if (
      navigator.geolocation &&
      nearNeighbours.filter((nb) => nb.address.meli_id === -1).length === 0
    ) {
      navigator.geolocation.getCurrentPosition((pos) =>
        getNearNeighbours(
          new GeoPoint({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
          1
        ).then((r) =>
          setNearNeighbours((n) => [
            ...n,
            {
              address: {
                meli_id: -1,
                name: 'Tu ubicación actual',
                geolocation: new GeoPoint({
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
                }),
              },
              neighbour: r,
            },
          ])
        )
      );
    }
  }, []);

  /* Si hay un usuario llama al Init */
  React.useEffect(() => {
    async function newUserFlow() {
      if (sessionState.meliUser && sessionState.neighbour) {
        /**
         * Si es usuario nuevo abre el modal de direcciones
         */
        if (!sessionState.neighbour.importAddresses) {
          const addresses = await get<UserAddress[]>(
            `${MELI_ENDPOINTS.users.me.addresses.URL}`
          );
          setSavedAddresses(addresses);
          onOpen();
        }
      }
    }
    newUserFlow();
  }, [sessionState.meliUser?.id, sessionState.neighbour]);

  /* Cada vez que cambien las addresses del usuario logueado, se fija las que no están y las agrega a las direcciones para buscar los neighbour cercanos   */
  React.useEffect(() => {
    if (
      sessionState.neighbour &&
      sessionState.neighbour.addresses &&
      sessionState.neighbour.addresses?.length > 0
    ) {
      let copyNearNeighbours = nearNeighbours;
      const addressesNoAgregadas = sessionState.neighbour.addresses.filter(
        (a) =>
          nearNeighbours.findIndex((nnb) => nnb.address.meli_id === a.meli_id) <
          0
      );
      setNearNeighbours((n) => [
        ...n,
        ...addressesNoAgregadas.map((ana) => ({
          address: ana,
          neighbour: [],
        })),
      ]);

      if (addressesNoAgregadas.length > 0) {
        Promise.all(
          addressesNoAgregadas.map((ana) =>
            getNearNeighbours(ana.geolocation, 1)
          )
        ).then((nbs) => {
          for (let index = 0; index < nbs.length; index++) {
            //copyNearNeighbours[index].neighbour = nbs[index];
            copyNearNeighbours.push({
              address: addressesNoAgregadas[index],
              neighbour: nbs[index],
            });
          }
          setNearNeighbours(copyNearNeighbours);
        });
      }
    }
  }, [sessionState.neighbour?.addresses]);

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
        addresses: [
          ...sessionState.neighbour.addresses!,
          ...newMelinoAddresses,
        ],
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

  const onSearchInputSubmit = async (searchResult: SearchedResult) => {
    if (!searchResult.id) {
      return toast({
        description: 'No pudimos encontrar nada en la URL ingresada',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
    let redirectId: string = searchResult.id;
    if (searchResult.isCatalogProduct) {
      const product = await meliFetch<Product>(
        `https://api.mercadolibre.com/products/${searchResult.id}`
      );
      redirectId = product.buy_box_winner.item_id;
    }
    history.push(`/detail/${redirectId}`);
  };

  return (
    <>
      <WelcomeModal
        isOpen={isOpen}
        onClose={closeModalHandler}
        savedAddresses={savedAddresses}
      />
      <Box w={'full'} bgColor={'yellow.meli'}>
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
          <SearchInput onSubmit={onSearchInputSubmit} />
        </Container>
      </Box>
      <Container
        mt={6}
        maxW='container.xl'
        pos={'relative'}
        pt={'30px'}
        pb={'60px'}
      >
        {nearNeighbours
          .filter((nnb) => nnb.neighbour.length > 0)
          .map((nb, i) => (
            <NearNeighbourList
              key={`nbfh-${i}`}
              nearNeighbour={nb}
            ></NearNeighbourList>
          ))}
      </Container>
    </>
  );
};
