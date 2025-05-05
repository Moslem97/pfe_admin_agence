import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UploadedDocument {
  id: number;
  appointmentId: number;
  fileName: string;
  name: string;
  status?: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:8081/api/admin/documents'; // Adjust if your backend URL/port is different

  constructor(private http: HttpClient) {}

  // Fetch documents for the admin's agency
  getDocumentsForAdmin(adminCin: string): Observable<UploadedDocument[]> {
    return this.http.get<UploadedDocument[]>(`${this.apiUrl}/list?cin=${adminCin}`);
  }

  // Download a document by ID
  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${id}`, { responseType: 'blob' });
  }
  // In document.service.ts
  updateDocumentStatus(id: number, status: boolean): Observable<void> {
    const headers = new HttpHeaders().set('X-Admin-CIN', localStorage.getItem('adminCin') || '');
    return this.http.put<void>(`${this.apiUrl}/${id}/status`, { status }, { headers });
  }
}