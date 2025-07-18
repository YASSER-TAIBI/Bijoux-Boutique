import { Routes } from '@angular/router';
import { AdminComponent } from '../components/admin/admin.component';
import { DashboardComponent } from '../components/admin/dashboard/dashboard.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
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
