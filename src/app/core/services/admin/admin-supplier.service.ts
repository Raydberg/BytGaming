import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { SupplierModel } from '../../model/supplier.model';
import { catchError, Observable, throwError } from 'rxjs';
import { SupplierRequest } from '../../interfaces/supplier-http.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminSupplierService {
  private http = inject(HttpClient)
  private baseUrl = environment.apiUrl

  getSuppliers(): Observable<SupplierModel[]> {
    return this.http.get<SupplierModel[]>(`${this.baseUrl}/api/suppliers`).pipe(
      catchError(error => {
        console.error("Error al traer los proveedores", error)
        return throwError(() => new Error("Error al traer los proveedores"))
      }))
  }

  getSupplierId(id: number): Observable<SupplierModel> {
    return this.http.get<SupplierModel>(`${this.baseUrl}/api/suppliers/${id}`).pipe(
      catchError(error => {
        console.error(`Error al traer el proveedor con ID ${id}`, error)
        return throwError(() => new Error(`Error al traer el proveedor con ID ${id}`))
      }))
  }

  createSupplier(supplier: SupplierRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/suppliers`, supplier).pipe(
      catchError(error => {
        console.error("Error al crear el proveedor", error)
        return throwError(() => new Error("Error al crear el proveedor"))
      }))
  }

  // Actualizado parcial - solo envía los campos que se necesitan actualizar
  updateSupplier(newSupplier: SupplierRequest, id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/suppliers/${id}`, newSupplier).pipe(
      catchError(error => {
        console.error(`Error al actualizar el proveedor con ID ${id}`, error)
        return throwError(() => new Error(`Error al actualizar el proveedor con ID ${id}`))
      }))
  }

  deleteSupplier(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/suppliers/${id}`).pipe(
      catchError(error => {
        console.error(`Error al eliminar el proveedor con ID ${id}`, error)
        return throwError(() => new Error(`Error al eliminar el proveedor con ID ${id}`))
      }))
  }
}
