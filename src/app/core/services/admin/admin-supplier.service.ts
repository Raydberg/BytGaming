import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { SupplierModel } from '../../model/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class AdminSupplierService {
  private http = inject(HttpClient)
  private baseUrl = environment.apiUrl

  getSuppliersRs() {
    return httpResource<SupplierModel[]>
      (
        {
          url: `http://localhost:8081/api/suppliers`,
          method: 'GET'
        },
        {
          defaultValue: []
        }
      )
  }

  constructor() {
    console.log(this.getSuppliersRs().value())
  }

}
