import { SimpleValue } from './../simpleValue';

export interface Product {
  id: string;
  status: string;
  sold_quantity: number;
  domain_id: string;
  permalink: string;
  name: string;
  buy_box_winner: WinnerItem;
  pickers: Picker[];
  pictures: ProductPicture[];
  main_features: MainFeature[];
  attributes: ProductAttribute[];
  short_description: ShortDescription;
  parent_id: string;
  children_ids: any[];
  settings: Settings;
}

export interface Installments {
  quantity: number;
  amount: number;
  rate: number;
  currency_id: string;
}

export interface Shipping {
  mode: string;
  tags: string[];
  free_shipping: boolean;
  logistic_type: string;
  store_pick_up: boolean;
}

export interface ValueStruct {
  number: number;
  unit: string;
}

export interface WinnerItem {
  item_id: string;
  product_id: string;
  category_id: string;
  seller_id: number;
  price: number;
  currency_id: string;
  sold_quantity: number;
  available_quantity: number;
  installments: Installments;
  shipping: Shipping;
  warranty: string;
  condition: string;
  official_store_id: number;
  original_price?: any;
  listing_type_id: string;
  accepts_mercadopago: boolean;
  tags: string[];
  item_override_attributes: any[];
  deal_ids: string[];
}

export interface Product {
  product_id: string;
  picker_label: string;
  picture_id: string;
  thumbnail: string;
  tags: string[];
  permalink: string;
}

export interface Picker {
  picker_id: string;
  picker_name: string;
  products: Product[];
}

export interface ProductPicture {
  id: string;
  url: string;
  suggested_for_picker: string[];
  max_width: number;
  max_height: number;
}

export interface Metadata {
  key: string;
  value: string;
}

export interface MainFeature {
  text: string;
  type: string;
  metadata: Metadata;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value_id: string;
  value_name: string;
  values: SimpleValue[];
}

export interface ShortDescription {
  type: string;
  content: string;
}

export interface Settings {
  listing_strategy: string;
  has_rich_description: boolean;
}
