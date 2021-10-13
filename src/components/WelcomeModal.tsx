import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Box,
  Text,
  HStack,
  Center,
  Checkbox,
} from '@chakra-ui/react';
import { UserAddress } from '../models/meli/userAddress';

interface Props {
  isOpen: boolean;
  savedAddresses: UserAddress[];
  onClose: (selectedAddressIds: number[]) => void;
}

export const WelcomeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  savedAddresses,
}) => {
  const [selectedAddressIds, setSelectedAddressIds] = React.useState<number[]>(
    []
  );
  React.useEffect(
    () => setSelectedAddressIds(savedAddresses.map((a) => a.id)),
    [savedAddresses]
  );

  const changeCheckboxHandler = (address: UserAddress) => {
    const idx = selectedAddressIds.indexOf(address.id);
    if (idx >= 0) {
      const newAddressIds = [...selectedAddressIds];
      newAddressIds.splice(idx, 1);
      setSelectedAddressIds(newAddressIds);
      return;
    }
    setSelectedAddressIds([...selectedAddressIds, address.id]);
  };
  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={() => onClose(selectedAddressIds)}
      size={'xl'}
    >
      <ModalOverlay />
      <ModalContent backgroundColor='gray.meli'>
        <ModalHeader>¡Bienvenido a Melino!</ModalHeader>
        <ModalBody pb={6}>
          <Text as={'h2'} fontWeight={'bold'}>
            Domicilios
          </Text>
          <Box
            borderRadius='6px'
            backgroundColor={'white'}
            as='ul'
            w={'full'}
            mt={6}
            mb={3}
          >
            {savedAddresses.map((a, k) => (
              <HStack
                spacing='12px'
                as={'li'}
                flexDirection={'row'}
                key={`saved-add-${k}`}
                borderBottom='1px'
                borderColor='gray.meli'
                pt={2}
                pb={2}
              >
                <Center w='50px'>
                  <Checkbox
                    size='md'
                    colorScheme='blue'
                    isChecked={selectedAddressIds.includes(a.id)}
                    onChange={(_) => changeCheckboxHandler(a)}
                  />
                </Center>
                <Box w={'full'}>
                  <Text mb={1}>{a.address_line}</Text>
                  <Text opacity={0.5}>
                    {a.city.name}({a.zip_code}), {a.state.name}{' '}
                  </Text>
                  <Text opacity={0.5}>{a.contact}</Text>
                </Box>
              </HStack>
            ))}
          </Box>
          <Text fontSize='sm'>
            Los domicilios que selecciones serán utilizados para saber si tiene
            algún vecino cerca con el cual pueda compartir gastos de envío.
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme='blue'
            mr={3}
            onClick={() => onClose(selectedAddressIds)}
          >
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
