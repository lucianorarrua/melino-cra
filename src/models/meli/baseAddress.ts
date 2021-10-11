import { SimpleValue } from '../simpleValue';

export interface CountryLocation {
  state: SimpleValue;
  city: SimpleValue;
  neighborhood: SimpleValue;
}

export interface BaseAddress extends CountryLocation {
  id: number;
  country: SimpleValue;
  municipality: SimpleValue;
  search_location: CountryLocation;
}
