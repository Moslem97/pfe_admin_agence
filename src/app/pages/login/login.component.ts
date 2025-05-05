import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class AdminLoginComponent {
  cin: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login(): void {
    console.log('Logging in with CIN:', this.cin); // Debug log
    this.http.post('http://localhost:8081/admin/login', { cin: this.cin, password: this.password })
      .subscribe({
        next: (response: any) => {
          console.log('Login successful, setting adminCin:', this.cin); // Debug log
          localStorage.setItem('adminCin', this.cin);
          this.router.navigate(['/admin/documents']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Invalid credentials');
        }
      });
  }
}