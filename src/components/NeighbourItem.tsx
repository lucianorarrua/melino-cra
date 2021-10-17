import {
  Box,
  Center,
  Button,
  Image,
  Text,
  Collapse,
  Skeleton,
} from '@chakra-ui/react';
import React from 'react';
import { Neighbour } from '../models/melino/neighbour';
import { getW } from '../utils/pictures';

interface Props {
  neighbour: Neighbour;
}

export const NeighbourItem: React.FC<Props> = ({ neighbour }) => {
  const [hover, setHover] = React.useState(false);
  const [randomIndex, setRandomIndex] = React.useState(-1);

  React.useEffect(
    () =>
      setRandomIndex(
        Math.floor(Math.random() * neighbour.desiredItems!?.length)
      ),
    []
  );

  if (randomIndex < 0) {
    return (
      <Box
        width={'calc((100% / 5) - 10px)'}
        minWidth={'230px'}
        overflowX={'auto'}
        ml={'5px'}
        mr={'5px'}
        bgColor={'white'}
        boxShadow={'0 1px 1px 0 rgba(0,0,0,.1)'}
        borderRadius={4}
        overflow={'hidden'}
        p={3}
      >
        <Center
          minW={'full'}
          boxSize={'200px'}
          borderBottom={'solid'}
          borderBottomColor={'gray.meli'}
          borderBottomWidth={'1px'}
        >
          <Skeleton height='190px' />
        </Center>
        <Skeleton height='13px' />
        <Skeleton height='13px' />
        <Skeleton height='13px' />
      </Box>
    );
  }

  return (
    <Box
      width={'calc((100% / 5) - 10px)'}
      minWidth={'230px'}
      overflowX={'auto'}
      ml={'5px'}
      mr={'5px'}
      bgColor={'white'}
      boxShadow={'0 1px 1px 0 rgba(0,0,0,.1)'}
      borderRadius={4}
      overflow={'hidden'}
      p={3}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Center
        minW={'full'}
        boxSize={'200px'}
        borderBottom={'solid'}
        borderBottomColor={'gray.meli'}
        borderBottomWidth={'1px'}
      >
        <Image
          as={'img'}
          w={'full'}
          h={'auto'}
          maxW={`${getW(
            neighbour.desiredItems![randomIndex].main_picture.size
          )}px`}
          src={neighbour.desiredItems![randomIndex].main_picture.url}
          alt={`Imagen de ${neighbour.desiredItems![randomIndex].title}`}
        ></Image>
      </Center>
      <Text fontSize={'sm'} maxH={'148px'}>
        <b>{neighbour.name}</b> está buscando{' '}
        {neighbour.desiredItems![randomIndex].title}
      </Text>
      <Collapse in={hover} animateOpacity>
        <Box w={'full'} mt={3}>
          <Button colorScheme='blue' size='sm' w={'full'} disabled={true}>
            Hablar con {neighbour.name}
          </Button>
          <Box p={1}>
            <Text
              as={'a'}
              fontSize={'sm'}
              href={`https://listado.mercadolibre.com.ar/_CustId_${
                neighbour.desiredItems![randomIndex].seller_id
              }`}
              color={'blue.500'}
              _hover={{ color: 'blue.600' }}
              target={'_blank'}
            >
              Ver otros productos del vendedor
            </Text>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};
