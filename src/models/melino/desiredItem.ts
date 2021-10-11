import { SimpleValue } from '../simpleValue';
import { Address } from './address';

export interface DesiredItem {
  /* item.id*/
  id: string;
  /* item.seller_address.search_location.neighborhood */
  neighborhood: SimpleValue;
  /* item.seller_id */
  seller_id: number;
  /* item.title */
  title: string;
  /* Direcciones donde le gustaría recibir el producto */
  addresses: Address[];
}
