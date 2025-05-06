export interface ProductModel {
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
