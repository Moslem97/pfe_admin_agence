import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AdminDashboardComponent } from './pages/dashboard/dashboard.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { AdminDocumentReviewComponent } from './pages/admin-document-review/admin-document-review.component';
import { AdminLoginComponent } from './pages/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AdminDashboardComponent,UserManagementComponent,AdminDocumentReviewComponent,RouterOutlet,AdminLoginComponent],
  template: `
    <router-outlet></router-outlet>
  `,
 
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    console.log('AppComponent initialized, current URL:', this.router.url);
  }
}