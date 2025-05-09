import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable, catchError, throwError } from 'rxjs';
import { CategoryModel } from '../../model/category.model';
import { CategoryRequest } from '../../interfaces/category-http.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminCategoryService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getAllCategory(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(`${this.baseUrl}/api/category`).pipe(
      catchError(error => {
        console.error("Error fetching categories data:", error);
        return throwError(() => new Error("Failed to fetch categories data"));
      })
    );
  }

  getCategoryById(id: number): Observable<CategoryModel> {
    return this.http.get<CategoryModel>(`${this.baseUrl}/api/category/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching category with id ${id}:`, error);
        return throwError(() => new Error(`Failed to fetch category with id ${id}`));
      })
    );
  }

  createCategory(newCategory: CategoryRequest): Observable<CategoryModel> {
    return this.http.post<CategoryModel>(`${this.baseUrl}/api/category`, newCategory).pipe(
      catchError(error => {
        console.error("Error creating category:", error);
        return throwError(() => new Error("Failed to create category"));
      })
    );
  }

  updateCategory(id: number, updateCategory: CategoryRequest): Observable<any> {
    // Corregido "categort" a "category"
    return this.http.put(`${this.baseUrl}/api/category/${id}`, updateCategory).pipe(
      catchError(error => {
        console.error(`Error updating category with id ${id}:`, error);
        return throwError(() => new Error(`Failed to update category with id ${id}`));
      })
    );
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/category/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting category with id ${id}:`, error);
        return throwError(() => new Error(`Failed to delete category with id ${id}`));
      })
    );
  }
}
