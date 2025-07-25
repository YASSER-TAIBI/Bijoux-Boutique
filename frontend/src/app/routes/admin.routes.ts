import { Routes } from '@angular/router';
import { AdminComponent } from '../components/admin/admin.component';
import { DashboardComponent } from '../components/admin/dashboard/dashboard.component';
import { AdminGuard } from '../guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard], // Protection de toute la section admin
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
    ]
  }
];
