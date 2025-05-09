import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable, catchError, throwError } from 'rxjs';
import { ProductModel } from '../../model/product.model';
import { ProductRequest } from '../../interfaces/product-http.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminProductService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  constructor() { }

  getAllProduct(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${this.baseUrl}/api/products`).pipe(
      catchError(error => {
        console.error("Error fetching products data:", error);
        return throwError(() => new Error("Failed to fetch products data"));
      })
    );
  }

  getProductById(id: number): Observable<ProductModel> {
    return this.http.get<ProductModel>(`${this.baseUrl}/api/products/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching product with id ${id}:`, error);
        return throwError(() => new Error(`Failed to fetch product with id ${id}`));
      })
    );
  }

  createProduct(productRequest: ProductRequest): Observable<any> {
    // Crear un objeto FormData para enviar datos multipart
    const formData = new FormData();

    // Agregar los campos del producto al FormData
    if (productRequest.nameProduct) formData.append('nameProduct', productRequest.nameProduct);
    if (productRequest.description) formData.append('description', productRequest.description);
    if (productRequest.price !== undefined) formData.append('price', productRequest.price.toString());
    if (productRequest.units !== undefined) formData.append('units', productRequest.units.toString());
    if (productRequest.isActive !== undefined) formData.append('isActive', productRequest.isActive.toString());
    if (productRequest.categoryId !== undefined) formData.append('categoryId', productRequest.categoryId.toString());

    // Agregar el archivo (imagen) al FormData si existe
    if (productRequest.file) {
      formData.append('file', productRequest.file, productRequest.file.name);
    }

    return this.http.post(`${this.baseUrl}/api/products`, formData).pipe(
      catchError(error => {
        console.error("Error creating product:", error);
        return throwError(() => new Error("Failed to create product"));
      })
    );
  }

  updateProduct(id: number, productRequest: ProductRequest): Observable<any> {
    // Crear un objeto FormData para enviar datos multipart
    const formData = new FormData();

    // Agregar los campos del producto al FormData, sólo si están definidos
    if (productRequest.nameProduct) formData.append('nameProduct', productRequest.nameProduct);
    if (productRequest.description) formData.append('description', productRequest.description);
    if (productRequest.price !== undefined) formData.append('price', productRequest.price.toString());
    if (productRequest.units !== undefined) formData.append('units', productRequest.units.toString());
    if (productRequest.isActive !== undefined) formData.append('isActive', productRequest.isActive.toString());
    if (productRequest.categoryId !== undefined) formData.append('categoryId', productRequest.categoryId.toString());

    // Agregar el archivo (imagen) al FormData si existe
    if (productRequest.file) {
      formData.append('file', productRequest.file, productRequest.file.name);
    }

    return this.http.put(`${this.baseUrl}/api/products/${id}`, formData).pipe(
      catchError(error => {
        console.error(`Error updating product with id ${id}:`, error);
        return throwError(() => new Error(`Failed to update product with id ${id}`));
      })
    );
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/products/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting product with id ${id}:`, error);
        return throwError(() => new Error(`Failed to delete product with id ${id}`));
      })
    );
  }

  toggleProductStatus(id: number, isActive: boolean): Observable<any> {
    return this.http.patch(`${this.baseUrl}/api/products/${id}/status`, { isActive }).pipe(
      catchError(error => {
        console.error(`Error toggling product status with id ${id}:`, error);
        return throwError(() => new Error(`Failed to toggle product status with id ${id}`));
      })
    );
  }
}
