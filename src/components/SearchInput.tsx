import { Box } from '@chakra-ui/react';
import React from 'react';

export interface SearchedResult {
  isCatalogProduct: boolean;
  id: string;
  error: boolean;
}

interface Props {
  onSubmit: (result: SearchedResult) => void;
}

export const SearchInput: React.FC<Props> = ({ onSubmit }) => {
  const [searchInput, setSearchInput] = React.useState('');

  const inputHandler = (event: any) => setSearchInput(event.target.value);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    let urlO: URL;
    try {
      urlO = new URL(searchInput);
    } catch (error) {
      onSubmit({ id: '', isCatalogProduct: false, error: true });
      return;
    }

    const pathnameSplited = urlO.pathname.split('/');
    if (pathnameSplited.includes('p')) {
      /* Si la URL contiene un recurso /p/ID, entonces es un CatalogProduct y "ID" es el Id de dicho Product. */
      onSubmit({
        id: pathnameSplited[3],
        isCatalogProduct: true,
        error: false,
      });
    } else {
      /* Caso contrario, es un item y su ID se encuentra en la primera parte de la URL, el cual extraemos con un REGEX. */
      let regex = /(MLA-\d*-)/;
      const regexResult = regex.exec(pathnameSplited[1]) || [];
      const result = (regexResult[0] || '').replaceAll('-', '');
      onSubmit({ id: result, isCatalogProduct: false, error: false });
    }
  };

  return (
    <Box w={'full'} as={'form'} onSubmit={handleSubmit}>
      <Box
        w={'full'}
        as={'input'}
        p={'7px 60px 9px 15px'}
        borderRadius={'md'}
        boxShadow={'rgba(0, 0, 0, 0.2) 0px 1px 2px 0px'}
        pos='absolute'
        bottom={'-20px'}
        placeholder={'Ingresá una URL de mercadolibre.com y presioná enter'}
        right={0}
        left={0}
        value={searchInput}
        onChange={inputHandler}
      ></Box>
    </Box>
  );
};
