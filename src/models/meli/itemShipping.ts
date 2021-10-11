export interface ShippingMethodRule {
  default: boolean;
  free_mode: string;
  free_shipping_flag: boolean;
  value?: any;
}

export interface ShippingMethod {
  id: number;
  rule: ShippingMethodRule;
}

export interface ItemShipping {
  mode: string;
  free_methods: ShippingMethod[];
  tags: string[];
  dimensions?: any;
  local_pick_up: boolean;
  free_shipping: boolean;
  logistic_type: string;
  store_pick_up: boolean;
}
