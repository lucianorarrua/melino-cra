import { Address } from './address';
import { DesiredItem } from './desiredItem';

export interface Neighbour {
  /* Id en ParsePlatform */
  objectId: string;
  /* Lista de items deseados por el vecino */
  desiredItems: DesiredItem[];
  /* Usuario en meli  */
  meliUserId: number;
  /* Direcciones que el vecino tiene almacenadas */
  addresses: Address[];
}
