import { HttpClient, httpResource } from '@angular/common/http';
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

  getSuppliers(): Observable<SupplierModel> {
    return this.http.get<SupplierModel>(`${this.baseUrl}/api/suppliers`).pipe(
      catchError(error => {
        console.error("Error al traer los proveedores", error)
        return throwError(() => new Error("Error al trar los proveedores", error.message))
      }))
  }

  getSupplierId(id: number): Observable<SupplierModel> {
    return this.http.get<SupplierModel>(`${this.baseUrl}/api/supplier/${id}`)
  }


  createSupplier(supplier: SupplierRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/suppliers`, supplier)
  }

  //Eliminado parcial
  updateSupplier(newSupplier: SupplierRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/suppliers`, newSupplier)
  }


  deleteSupplier(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/suppliers/${id}`)
  }


}
