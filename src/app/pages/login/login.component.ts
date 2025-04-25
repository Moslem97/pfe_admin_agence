import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  cin: string = '';
  password: string = '';
  message: string = '';
  isSuccess: boolean = false;

  constructor(private http: HttpClient) {}

  onSubmit() {
    const loginData = { cin: this.cin, password: this.password };
    this.http.post('http://localhost:8081/admin/login', loginData, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.message = response;
          this.isSuccess = response === 'Login successful';
        },
        error: (error) => {
          this.message = 'An error occurred. Please try again.';
          this.isSuccess = false;
          console.error('Login error:', error);
        }
      });
  }
}