import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { StaffModel } from '../../model/staff.model';
import { StaffRequest } from '../../interfaces/staff-http.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminStaffService {
  private http = inject(HttpClient)
  private baseUrl = environment.apiUrl
  getAllStaff(): Observable<StaffModel> {
    return this.http.get<StaffModel>(`${this.baseUrl}/api/staff`)
  }

  getStaffById(id: number): Observable<StaffModel> {
    return this.http.get<StaffModel>(`${this.baseUrl}/api/staff/${id}`)
  }

  createStaff(staff: StaffRequest): Observable<StaffModel> {
    return this.http.post<StaffModel>(`${this.baseUrl}/api/staff`, staff)
  }

  //Actualizado parcial
  updateStaff(newStaff: StaffRequest, id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/staff/${id}`, newStaff)
  }


  deleteStaff(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/staff/${id}`)
  }



}
