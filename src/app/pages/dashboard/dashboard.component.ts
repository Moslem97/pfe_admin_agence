import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Service {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  services: Service[] = [];
  selectedService: Service = { id: 0, name: '', description: '' };
  isEditing = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.http.get<Service[]>('http://localhost:8081/api/services').subscribe({
      next: (data) => {
        this.services = data;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Failed to load services.';
      }
    });
  }

  onSubmit() {
    if (this.isEditing) {
      this.updateService();
    } else {
      this.createService();
    }
  }

  createService() {
    const { id, ...serviceData } = this.selectedService; // Omit the id field
    this.http.post<Service>('http://localhost:8081/api/services', serviceData).subscribe({
      next: (service) => {
        this.services.push(service);
        this.resetForm();
        this.errorMessage = 'Service created successfully!';
      },
      error: () => {
        this.errorMessage = 'Failed to create service.';
      }
    });
}

  updateService() {
    this.http.put<Service>(`http://localhost:8081/api/services/${this.selectedService.id}`, this.selectedService).subscribe({
      next: (service) => {
        const index = this.services.findIndex(s => s.id === service.id);
        if (index !== -1) {
          this.services[index] = service;
        }
        this.resetForm();
        this.errorMessage = 'Service updated successfully!';
      },
      error: () => {
        this.errorMessage = 'Failed to update service.';
      }
    });
  }

  editService(service: Service) {
    this.selectedService = { ...service };
    this.isEditing = true;
  }

  deleteService(id: number) {
    if (confirm('Are you sure you want to delete this service?')) {
      this.http.delete(`http://localhost:8081/api/services/${id}`).subscribe({
        next: () => {
          this.services = this.services.filter(s => s.id !== id);
          this.errorMessage = 'Service deleted successfully!';
        },
        error: () => {
          this.errorMessage = 'Failed to delete service.';
        }
      });
    }
  }

  resetForm() {
    this.selectedService = { id: 0, name: '', description: '' };
    this.isEditing = false;
    setTimeout(() => this.errorMessage = '', 3000);
  }
}