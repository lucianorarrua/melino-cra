import { GeoPoint } from 'parse';

export interface Address {
  /* Id en ParsePlatform */
  objectId?: string;
  /* nombre de la dirección. 
     Si se trae desde Meli debe tener el formato "street_name + street_number + city.name + (zip_code) 
     */
  name: string;
  /* id de la address en Meli. Si es null, es porque se cargó manualmente desde Melino */
  meli_id: number;
  /* Latitud y longitud en GoogleMaps */
  geolocation: GeoPoint;
}
