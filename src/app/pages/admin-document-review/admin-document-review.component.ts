
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface UploadedDocument {
  id: number;
  appointmentId: number;
  name: string;
  fileName: string;
  status: string;
}

@Component({
  selector: 'app-admin-document-review',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './admin-document-review.component.html',
  styleUrls: ['./admin-document-review.component.css']
})
export class AdminDocumentReviewComponent implements OnInit {
  documents: UploadedDocument[] = [];
  agencyId: number = 0;

  constructor(private http: HttpClient) {
    this.http.get<any>('http://localhost:8081/api/admin/profile', {
      headers: this.getHeaders()
    }).subscribe({
      next: (admin) => {
        this.agencyId = admin.agency.id;
        this.loadDocuments();
      },
      error: () => {
        alert('Please log in as admin.');
      }
    });
  }

  ngOnInit(): void {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin_cin:admin_password') // Replace with JWT or dynamic credentials
    });
  }

  loadDocuments(): void {
    this.http.get<UploadedDocument[]>(`http://localhost:8081/api/admin/documents/agency/${this.agencyId}`, {
      headers: this.getHeaders()
    }).subscribe({
      next: (data) => {
        this.documents = data;
      },
      error: (error) => {
        console.error('Error fetching documents:', error);
        alert('Failed to load documents.');
      }
    });
  }

  downloadDocument(documentId: number, documentName: string): void {
    this.http.get(`http://localhost:8081/api/admin/documents/${documentId}/download`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = documentName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading document:', error);
        alert('Failed to download document.');
      }
    });
  }

  updateStatus(documentId: number, status: string | null): void {
    if (!status || status === '') {
      return; // Ignore empty or null status
    }
    this.http.put(`http://localhost:8081/api/admin/documents/${documentId}/status`, status, {
      headers: this.getHeaders().set('Content-Type', 'application/json')
    }).subscribe({
      next: () => {
        alert('Status updated successfully.');
        this.loadDocuments();
      },
      error: (error) => {
        console.error('Error updating status:', error);
        alert('Failed to update status.');
      }
    });
  }
}
