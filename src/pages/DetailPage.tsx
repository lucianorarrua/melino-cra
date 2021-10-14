import {
  Box,
  Container,
  Grid,
  GridItem,
  Text,
  VStack,
  Tooltip,
  Button,
  Progress,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import { useLocation, useParams } from 'react-router';
import { deleteParseObject, updateNeighbour } from '../api/back4App';
import { ImageViewer } from '../components/ImageViewer';
import { useSession } from '../hooks/useSession';
import { Attribute, Item } from '../models/meli/item';
import { meliFetch } from '../utils/fetch';

type DetailPageParams = {
  itemId: string;
};

const DetailPage = () => {
  const [item, setItem] = React.useState<Item | null>(null);
  const [isDesired, setIsDesired] = React.useState(false);
  const [fetching, setFetching] = React.useState(false);
  const location = useLocation();
  let { itemId } = useParams<DetailPageParams>();
  const { sessionState, updateNeighbourAndSave } = useSession();
  const toast = useToast();

  React.useEffect(() => {
    meliFetch<Item>(`https://api.mercadolibre.com/items/${itemId}`)
      .then((i) => setItem(i))
      .catch();
  }, [location, itemId]);

  React.useEffect(() => {
    if (sessionState.neighbour) {
      setIsDesired(
        sessionState.neighbour.desiredItems?.findIndex(
          (di) => di.item_id === itemId
        ) !== -1
      );
    }
  }, [sessionState.neighbour, itemId]);

  const getAttById = (id: string): Attribute | undefined =>
    item!.attributes.find((a) => a.id === id);

  const toastError = () =>
    toast({
      title: 'Algo salió mal 😓',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });

  async function addDesiredButtonHandler() {
    let desiredItems = sessionState.neighbour?.desiredItems || [];
    if (!item || !desiredItems) {
      return;
    }
    setFetching(true);
    updateNeighbour({
      ...sessionState.neighbour!,
      desiredItems: [
        ...desiredItems,
        {
          item_id: item.id,
          seller_id: item.seller_id,
          title: item.title,
        },
      ],
    })
      .then(() => {
        updateNeighbourAndSave();
        setIsDesired(true);
      })
      .catch(toastError)
      .finally(() => setFetching(false));
  }

  async function removeDesiredButtonHandler() {
    let desiredItems = sessionState.neighbour?.desiredItems || [];
    const delItemIdx = desiredItems.findIndex(
      (i) => i.item_id === item?.id || ''
    );
    if (delItemIdx === -1) {
      return;
    }
    setFetching(true);
    deleteParseObject({
      className: 'DesiredItem',
      objectId: desiredItems[delItemIdx].objectId!,
    })
      .then(() => {
        updateNeighbourAndSave();
        setIsDesired(false);
      })
      .catch(toastError)
      .finally(() => setFetching(false));
  }

  if (!item || !sessionState.initValues) {
    return (
      <Progress size='lg' isIndeterminate colorScheme='yellow' opacity={0.5} />
    );
  }

  return (
    <Container maxW='container.lg' pt={6} pb={6}>
      <Grid
        borderRadius='6px'
        borderColor={'gray.meli'}
        border={'3px'}
        boxShadow={'0 1px 2px 0 rgba(0,0,0,.25)'}
        backgroundColor={'white'}
        h='500px'
        w={'full'}
        minW={'full'}
        /*         templateRows='repeat(1, 1fr)'
         */ templateRows='1fr 50px'
        templateColumns='repeat(3, 1fr)'
        overflow={'hidden'}
        p={'16px'}
        gap={'48px'}
      >
        <GridItem h={'full'} colSpan={2} rowSpan={1}>
          <ImageViewer itemTitle={item.title} pictures={item.pictures} />
        </GridItem>
        <GridItem
          colSpan={1}
          rowSpan={1}
          border={'1px'}
          borderRadius='6px'
          borderColor={'gray.meli'}
          p={'16px'}
          h={'min-content'}
        >
          <Text fontSize='sm' opacity={0.5} mb={1}>
            {getAttById('ITEM_CONDITION')?.value_name} | {item.sold_quantity}{' '}
            vendidos
          </Text>
          <Text fontSize='2xl' fontWeight={'bold'} mb={2} lineHeight={7}>
            {item.title}
          </Text>
          <Box mb={6}>
            <Text
              as={'span'}
              display={'block'}
              m={0}
              fontSize='4xl'
              fontWeight={'light'}
              lineHeight={1}
            >
              <Text as={'span'} mr={2}>
                $
              </Text>
              <span>{item.price}</span>
            </Text>
            <Text
              as={'span'}
              m={0}
              fontSize='lg'
              fontWeight={'light'}
              lineHeight={0}
            >
              <Text as={'span'} mr={2}>
                en 12x $
              </Text>
              <span>{(item.price / 12).toFixed(0)}</span>
            </Text>
          </Box>
          <VStack>
            <Tooltip
              label='Inicie sesión para agregar productos a su lista de deseados'
              isDisabled={!!sessionState.neighbour?.objectId}
            >
              <Box w={'full'}>
                {!isDesired && (
                  <Button
                    colorScheme='blue'
                    size='lg'
                    w={'full'}
                    disabled={!sessionState.neighbour?.objectId || fetching}
                    onClick={addDesiredButtonHandler}
                    isLoading={fetching}
                  >
                    Agregar a deseados
                  </Button>
                )}
                {isDesired && (
                  <Button
                    colorScheme='yellow'
                    variant='outline'
                    size='lg'
                    w={'full'}
                    disabled={fetching}
                    onClick={removeDesiredButtonHandler}
                    isLoading={fetching}
                  >
                    Quitar de deseados
                  </Button>
                )}
              </Box>
            </Tooltip>
            <Text
              w={'full'}
              as={'a'}
              href={item.permalink}
              color={'blue.500'}
              _hover={{ color: 'blue.600' }}
              target={'_blank'}
            >
              Ver en mercadolibre.com
            </Text>
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default DetailPage;
