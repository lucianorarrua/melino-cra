import { Address } from './address';
import { DesiredItem } from './desiredItem';

export interface Neighbour {
  /* Id en ParsePlatform */
  objectId?: string;
  /* Lista de items deseados por el vecino */
  desiredItems?: DesiredItem[] | null;
  /* Usuario en meli  */
  meliUserId: number;
  /* first_name en meli  */
  name: string;
  /* Direcciones que el vecino tiene almacenadas */
  addresses?: Address[] | null;
  /* Flag que indica si ya importó sus direcciones desde MELI */
  importAddresses?: Boolean;
}
