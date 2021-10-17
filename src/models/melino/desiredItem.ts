import { ItemPicture } from '../meli/item';
import { SimpleValue } from '../simpleValue';
import { Address } from './address';

export interface DesiredItem {
  /* Id en ParsePlatform */
  objectId?: string;
  /* item.id*/
  item_id: string;
  /* item.seller_id */
  seller_id: number;
  /* item.title */
  title: string;
  /* URL de la imagen a mostrar */
  main_picture: ItemPicture;
  /* Direcciones donde le gustaría recibir el producto */
  addresses?: Address[] | null;
}
