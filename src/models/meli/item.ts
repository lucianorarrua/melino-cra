import { BaseAddress } from './baseAddress';
import { ItemShipping } from './itemShipping';

/* Respuesta del endpoint https://api.mercadolibre.com/items?ids= */
export interface Item {
  id: string;
  site_id: string;
  title: string;
  subtitle?: any;
  seller_id: number;
  category_id: string;
  official_store_id: number;
  price: number;
  base_price: number;
  original_price?: any;
  currency_id: string;
  initial_quantity: number;
  available_quantity: number;
  sold_quantity: number;
  sale_terms: Attribute[];
  buying_mode: string;
  listing_type_id: string;
  start_time: Date;
  stop_time: Date;
  condition: string;
  permalink: string;
  thumbnail_id: string;
  thumbnail: string;
  secure_thumbnail: string;
  pictures: ItemPicture[];
  video_id?: any;
  descriptions: {
    id: string;
  }[];
  accepts_mercadopago: boolean;
  non_mercado_pago_payment_methods: any[];
  shipping: ItemShipping;
  international_delivery_mode: string;
  seller_address: BaseAddress;
  seller_contact?: any;
  location: Location;
  coverage_areas: any[];
  attributes: Attribute[];
  warnings: any[];
  listing_source: string;
  variations: any[];
  status: string;
  sub_status: any[];
  tags: string[];
  warranty: string;
  catalog_product_id: string;
  domain_id: string;
  parent_item_id?: any;
  differential_pricing?: any;
  deal_ids: string[];
  automatic_relist: boolean;
  date_created: Date;
  last_updated: Date;
  health?: any;
  catalog_listing: boolean;
  channels: string[];
}

export interface ValueStruct {
  number: number;
  unit: string;
}

export interface StructuredValue {
  id: string;
  name: string;
  struct: ValueStruct;
}

export interface ItemPicture {
  id: string;
  url: string;
  secure_url: string;
  size: string;
  max_size: string;
  quality: string;
}

export interface Attribute {
  id: string;
  name: string;
  value_id: string;
  value_name: string;
  value_struct: ValueStruct;
  values: StructuredValue[];
  attribute_group_id: string;
  attribute_group_name: string;
}
