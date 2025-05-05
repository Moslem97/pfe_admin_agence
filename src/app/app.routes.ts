import { Routes } from '@angular/router';

import { AdminDocumentReviewComponent } from './pages/admin-document-review/admin-document-review.component';
import { AdminLoginComponent } from './pages/login/login.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { AdminDashboardComponent } from './pages/dashboard/dashboard.component';


export const routes: Routes = [
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'admin/documents', component: AdminDocumentReviewComponent },
  {path:'userm',component:UserManagementComponent},
  {path:'services',component:AdminDashboardComponent},
  { path: '', redirectTo: '/admin-login', pathMatch: 'full' }
];