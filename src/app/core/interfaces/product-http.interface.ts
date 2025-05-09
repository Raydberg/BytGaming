export interface ProductRequest {
  nameProduct?: string;
  description?: string;
  price?: number;
  units?: number;
  isActive?: boolean;
  categoryId?: number;
  file?: File;
}
