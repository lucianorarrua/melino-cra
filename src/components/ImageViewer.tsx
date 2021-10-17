import { Center, Flex, VStack } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/react';
import React from 'react';
import { ItemPicture } from '../models/meli/item';
import { isPortrait, getW } from '../utils/pictures';

interface Props {
  pictures: ItemPicture[];
  itemTitle: string;
}

export const ImageViewer: React.FC<Props> = ({ pictures, itemTitle }) => {
  const [indexSelected, setIndexSelected] = React.useState(0);

  return (
    <Flex flexDirection={'row'} h={'full'}>
      <VStack as={'ul'} w={'50px'}>
        {pictures.map((p, k) => (
          <Center
            borderRadius={4}
            borderColor={indexSelected === k ? 'blue' : 'gray.300'}
            borderStyle={'solid'}
            borderWidth={indexSelected === k ? '2px' : '1px'}
            as={'li'}
            key={`thumb-${k}`}
            boxSize='49px'
            listStyleType={'none'}
            p={'2px'}
          >
            <Image
              as={'img'}
              w={isPortrait(p.size) ? 'auto' : 'full'}
              h={isPortrait(p.size) ? 'full' : 'auto'}
              src={p.secure_url}
              alt={`Imagen ${k + 1} de ${pictures.length + 1} de ${itemTitle}`}
              onMouseEnter={() => setIndexSelected(k)}
            ></Image>
          </Center>
        ))}
      </VStack>
      <Center minW={'full'}>
        <Image
          as={'img'}
          w={'full'}
          h={'auto'}
          maxW={`${getW(pictures[indexSelected].size)}px`}
          src={pictures[indexSelected].secure_url}
          alt={`Imagen ${indexSelected + 1} de ${
            pictures.length + 1
          } de ${itemTitle}`}
        ></Image>
      </Center>
    </Flex>
  );
};
