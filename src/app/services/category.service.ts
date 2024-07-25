import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Category } from "../models/category";
import { ApiResponse } from "../responses/api.response";
import { InsertCategoryDTO } from "../dtos/category/insert.category.dto";
import { UpdateCategoryDTO } from "../dtos/category/update.category.dto";

@Injectable({
    providedIn: 'root',
})
export class CategoryService {

    private apiGetCategories = `${environment.apiBaseUrl}/categories`;

    constructor(private http: HttpClient) { }

    getCategories(page: number, limit: number): Observable<ApiResponse> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        return this.http.get<ApiResponse>(this.apiGetCategories, { params });
    }
    getDetailCategory(id: number): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiGetCategories}/${id}`);
    }
    insertCategory(insertCategoryDTO: InsertCategoryDTO): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiGetCategories}`, insertCategoryDTO);
    }
    updateCategory(id: number, updateCategoryDTO: UpdateCategoryDTO) {
        return this.http.put<ApiResponse>(`${this.apiGetCategories}/${id}`, updateCategoryDTO);

    }
    deleteCategory(categoryId: number): Observable<ApiResponse> {
        return this.http.delete<ApiResponse>(`${this.apiGetCategories}/${categoryId}`);
    }
}
