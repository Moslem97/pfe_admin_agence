import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cin: string;
  rib: string;
  password: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  selectedUser: User = { id: 0, firstName: '', lastName: '', email: '', phone: '', cin: '', rib: '', password: '' };
  isEditing = false;
  showForm = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<User[]>('http://localhost:8081/api/users').subscribe({
      next: (data) => {
        this.users = data;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Failed to load users.';
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    } else {
      this.isEditing = false;
      this.selectedUser = { id: 0, firstName: '', lastName: '', email: '', phone: '', cin: '', rib: '', password: '' };
    }
  }

  onSubmit() {
    if (this.isEditing) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  createUser() {
    const { id, ...userData } = this.selectedUser; // Omit the id field
    this.http.post<User>('http://localhost:8081/api/users', userData).subscribe({
      next: (user) => {
        this.users.push(user);
        this.resetForm();
        this.showForm = false;
        this.errorMessage = 'User created successfully!';
      },
      error: () => {
        this.errorMessage = 'Failed to create user.';
      }
    });
  }

  updateUser() {
    this.http.put<User>(`http://localhost:8081/api/users/${this.selectedUser.id}`, this.selectedUser).subscribe({
      next: (user) => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = user;
        }
        this.resetForm();
        this.showForm = false;
        this.errorMessage = 'User updated successfully!';
      },
      error: () => {
        this.errorMessage = 'Failed to update user.';
      }
    });
  }

  editUser(user: User) {
    this.selectedUser = { ...user, password: '' }; // Don't pre-fill password for security
    this.isEditing = true;
    this.showForm = true;
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`http://localhost:8081/api/users/${id}`).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
          this.errorMessage = 'User deleted successfully!';
        },
        error: () => {
          this.errorMessage = 'Failed to delete user.';
        }
      });
    }
  }

  resetForm() {
    this.selectedUser = { id: 0, firstName: '', lastName: '', email: '', phone: '', cin: '', rib: '', password: '' };
    this.isEditing = false;
    setTimeout(() => this.errorMessage = '', 3000);
  }
}