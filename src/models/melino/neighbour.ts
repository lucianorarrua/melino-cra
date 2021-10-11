import { Address } from './address';
import { DesiredItem } from './desiredItem';

export interface Neighbour {
  desiredItems: DesiredItem[];
  /* Usuario en meli  */
  meli_user_id: number;
  /* Direcciones que el vecino tiene almacenadas */
  addresses: Address[];
}
