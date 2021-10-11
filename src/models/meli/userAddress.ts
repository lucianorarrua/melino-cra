import { BaseAddress } from './baseAddress';

export interface UserAddress extends BaseAddress {
  user_id: number;
  contact: string;
  phone: string;
  address_line: string;
  floor?: any;
  apartment?: any;
  street_number: string;
  street_name: string;
  zip_code: string;
  types: string[];
  comment: string;
  between: string;
  references: string;
  aditional_info: string;
  geolocation_type: string;
  geolocation_last_updated: Date;
  geolocation_source: string;
  latitude: number;
  longitude: number;
  status: string;
  date_created: Date;
  normalized: boolean;
  open_hours: OpenHours;
  address_type: string;
}

export interface HourRange {
  from: string;
  to: string;
}

export interface OpenHours {
  monday: HourRange[];
  tuesday: HourRange[];
  wednesday: HourRange[];
  thursday: HourRange[];
  friday: HourRange[];
  saturday: HourRange[];
  sunday: HourRange[];
  on_holidays: HourRange;
}
