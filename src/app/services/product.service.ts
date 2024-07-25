import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../environments/environment';
import { ApiResponse } from '../responses/api.response';
import { InsertProductDTO } from '../dtos/product/insert.product.dto';
import { UpdateProductDTO } from '../dtos/product/update.product.dto';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class  ProductService {

  private apiProducts = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient,
              private tokenService: TokenService
  ) { }

  getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number): Observable<ApiResponse> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('category_id',selectedCategoryId.toString())
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<ApiResponse>(this.apiProducts, { params });
  }
  getDetailProduct(productId: number):Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${this.apiProducts}/${productId}`);
  }

  getProductsByIds(productIds: number[]): Observable<Product[]>{
    debugger
    const params  = new HttpParams().set('ids',productIds.join(','));
    return this.http.get<Product[]>(`${this.apiProducts}/by-ids`,{ params });
  }
  deleteProduct(id: number): Observable<string>{
    return this.http.delete(`${this.apiProducts}/${id}`,{responseType: 'text'});
    
  } 
  updateProduct(productId: number, updatedProduct: UpdateProductDTO): Observable<any> {
    return this.http.put(`${this.apiProducts}/${productId}`, updatedProduct);
  }  
  insertProduct(insertProductDTO: InsertProductDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiProducts}`, insertProductDTO);
  }
  uploadImages(productId: number, files: File[]): Observable<ApiResponse> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    // Upload images for the specified product id
    return this.http.post<ApiResponse>(`${this.apiProducts}/uploads/${productId}`, formData,{
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.tokenService.getToken()}`,
        'Accept': 'application/json'
      })
    });
  }
  
  deleteProductImage(id: number): Observable<any> {
    debugger
    return this.http.delete(`${this.apiProducts}/images/${id}`,{responseType: 'text'});
  }
}


