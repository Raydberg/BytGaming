import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable, catchError, throwError } from 'rxjs';
import { StaffModel } from '../../model/staff.model';
import { StaffPost, StaffRequest } from '../../interfaces/staff-http.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminStaffService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getAllStaff(): Observable<StaffModel[]> {
    return this.http.get<StaffModel[]>(`${this.baseUrl}/api/staff`).pipe(
      catchError(error => {
        console.error("Error fetching staff data:", error);
        return throwError(() => new Error("Failed to fetch staff data"));
      })
    );
  }

  getStaffById(id: number): Observable<StaffModel> {
    return this.http.get<StaffModel>(`${this.baseUrl}/api/staff/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching staff with id ${id}:`, error);
        return throwError(() => new Error(`Failed to fetch staff with id ${id}`));
      })
    );
  }

  createStaff(staff: StaffRequest): Observable<StaffModel> {
    return this.http.post<StaffModel>(`${this.baseUrl}/api/staff`, staff).pipe(
      catchError(error => {
        console.error("Error creating staff:", error);
        return throwError(() => new Error("Failed to create staff"));
      })
    );
  }

  updateStaff(newStaff: StaffRequest, id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/staff/${id}`, newStaff).pipe(
      catchError(error => {
        console.error(`Error updating staff with id ${id}:`, error);
        return throwError(() => new Error(`Failed to update staff with id ${id}`));
      })
    );
  }

  deleteStaff(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/staff/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting staff with id ${id}:`, error);
        return throwError(() => new Error(`Failed to delete staff with id ${id}`));
      })
    );
  }
}
