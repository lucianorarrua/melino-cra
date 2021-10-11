/* Respuesta del endpoint https://api.mercadolibre.com/users/me */
export interface User {
  id: number;
  nickname: string;
  registration_date: Date;
  first_name: string;
  last_name: string;
  gender: string;
  country_id: string;
  email: string;
  identification: IdentityIdentification;
  address: { address: string; city: string; state: string; zip_code: string };
  phone: Phone;
  alternative_phone: Phone;
  user_type: string;
  tags: string[];
  logo?: any;
  points: number;
  site_id: string;
  permalink: string;
  shipping_modes: string[];
  seller_experience: string;
  seller_reputation: SellerReputation;
  buyer_reputation: BuyerReputation;
  status: UserStatus;
  secure_email: string;
  company: Company;
  credit: Credit;
  context: any;
  thumbnail: Thumbnail;
  registration_identifiers: any[];
}

export interface IdentityIdentification {
  number: string;
  type: string;
}

export interface Phone {
  area_code: string;
  extension: string;
  number: string;
  verified: boolean;
}

export interface Ratings {
  negative: number;
  neutral: number;
  positive: number;
}

export interface Transactions {
  canceled: number;
  completed?: number;
  period: string;
  ratings: Ratings;
  total?: number;
  not_yet_rated: Rate & { units?: any };
  unrated: Rate;
}

export interface MetricItem {
  period: string;
  rate: number;
  value: number;
}

export interface Metrics {
  sales: MetricItem & { completed: number };
  claims: MetricItem;
  delayed_handling_time: MetricItem;
  cancellations: MetricItem;
}

export interface SellerReputation {
  level_id?: any;
  power_seller_status?: any;
  transactions: Transactions;
  metrics: Metrics;
}

export interface BuyerReputation {
  canceled_transactions: number;
  tags: any[];
  transactions: Transactions;
}

export interface Rate {
  paid?: any;
  total?: any;
}

export interface ImmediatePayment {
  reasons: any[];
  required: boolean;
}

export interface UserStatusItem {
  allow: boolean;
  codes: any[];
  immediate_payment: ImmediatePayment;
}

export interface ShoppingCart {
  buy: string;
  sell: string;
}

export interface UserStatus {
  billing: UserStatusItem;
  buy: UserStatusItem;
  confirmed_email: boolean;
  shopping_cart: ShoppingCart;
  immediate_payment: boolean;
  list: UserStatusItem;
  mercadoenvios: string;
  mercadopago_account_type: string;
  mercadopago_tc_accepted: boolean;
  required_action: string;
  sell: UserStatusItem;
  site_status: string;
  user_type: string;
}

export interface Company {
  brand_name?: any;
  city_tax_id: string;
  corporate_name: string;
  identification: string;
  state_tax_id: string;
  cust_type_id: string;
  soft_descriptor: string;
}

export interface Credit {
  consumed: number;
  credit_level_id: string;
  rank: string;
}

export interface Thumbnail {
  picture_id: string;
  picture_url: string;
}
