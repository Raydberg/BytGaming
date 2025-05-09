import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment.development';
import {Observable} from 'rxjs';
import {UserModel} from '../../model/user.model';
import {RegisterRequest} from '../../interfaces/auth-http.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl

  constructor() {
  }


  getAllUsers(): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.baseUrl}/auth`)
  }

  updateUser(id: number, userUpdate: RegisterRequest): Observable<any> {
    return this.http.put(`${this.baseUrl}/auth/${id}`, userUpdate)
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/auth/${id}`)
  }

}
