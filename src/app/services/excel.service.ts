import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../responses/api.response';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

 
  exportExcel(data_name: string): Observable<Blob> {
    const url = `${this.apiBaseUrl}/excel/export/${data_name}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  downloadFile(blob: Blob, fileName: string): void {
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
  }
}
  
