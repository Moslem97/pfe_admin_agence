import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UploadedDocument, DocumentService } from '../../../Services/document.service';

@Component({
  selector: 'app-admin-document-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-document-review.component.html',
  styleUrls: ['./admin-document-review.component.css']
})
export class AdminDocumentReviewComponent implements OnInit {
  documents: UploadedDocument[] = [];
  adminCin: string | null = null;
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(private documentService: DocumentService, private router: Router) {}

  ngOnInit(): void {
    console.log('AdminDocumentReviewComponent initialized');
    this.adminCin = localStorage.getItem('adminCin');
    console.log('Admin CIN:', this.adminCin);

    if (!this.adminCin) {
      console.log('No adminCin found, redirecting to login');
      this.router.navigate(['/admin-login']);
      return;
    }

    this.loading = true;
    this.documentService.getDocumentsForAdmin(this.adminCin).subscribe({
      next: (docs) => {
        console.log('Documents received:', docs);
        this.documents = docs;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching documents:', err);
        this.errorMessage = 'Failed to load documents. Please try again later.';
        this.loading = false;
        if (err.status === 401) {
          console.log('Unauthorized, redirecting to login');
          this.router.navigate(['/admin-login']);
        }
      }
    });
  }

  downloadDocument(id: number, fileName: string): void {
    this.documentService.downloadDocument(id).subscribe({
      next: (blob) => {
        const typedBlob = new Blob([blob], { type: 'image/png' });
        const url = window.URL.createObjectURL(typedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error downloading document:', err);
        alert('Failed to download document');
      }
    });
  }

  validateDocument(id: number, status: boolean): void {
    this.documentService.updateDocumentStatus(id, status).subscribe({
      next: () => {
        console.log(`Document ${id} marked as ${status ? 'Valid' : 'Invalid'}`);
        const document = this.documents.find(doc => doc.id === id);
        if (document) {
          document.status = status;
        }
      },
      error: (err) => {
        console.error('Error updating document status:', err);
        alert('Failed to update document status');
      }
    });
  }

  logout(): void {
    localStorage.removeItem('adminCin');
    this.router.navigate(['/admin-login']);
  }
}