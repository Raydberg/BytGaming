export interface KardexModel {
  id:           number;
  product:      Product;
  quantity:     number;
  movementType: string;
  date:         Date;
  cost:         number;
  balance:      number;
  provider:     Provider;
  staff:        Staff;
}

export interface Product {
  id:          number;
  nameProduct: string;
  description: string;
  price:       number;
  units:       number;
  isActive:    boolean;
  image:       Image;
  category:    Category;
}

export interface Category {
  id:          number;
  nombre:      string;
  description: string;
}

export interface Image {
  id:       number;
  name:     string;
  imageUrl: string;
  imageId:  string;
}

export interface Provider {
  id:       number;
  name:     string;
  ruc:      string;
  email:    string;
  phone:    string;
  isActive: boolean;
}

export interface Staff {
  id:    number;
  name:  string;
  email: string;
  post:  string;
}
