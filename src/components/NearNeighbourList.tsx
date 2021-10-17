import { Flex, Text } from '@chakra-ui/layout';
import React from 'react';
import { Address } from '../models/melino/address';
import { Neighbour } from '../models/melino/neighbour';
import { NeighbourItem } from './NeighbourItem';

export type NearNeighbour = {
  address: Address;
  neighbour: Neighbour[];
};

interface Props {
  nearNeighbour: NearNeighbour;
}

export const NearNeighbourList: React.FC<Props> = ({ nearNeighbour }) => {
  return (
    <>
      <Text fontSize={'2xl'} fontWeight={'light'} mb={2}>
        Cerca de {nearNeighbour.address.name}
      </Text>
      <Flex direction={'row'}>
        {nearNeighbour.neighbour.map((nb, i) => (
          <NeighbourItem key={`asd-${i}`} neighbour={nb}></NeighbourItem>
        ))}{' '}
      </Flex>{' '}
    </>
  );
};
