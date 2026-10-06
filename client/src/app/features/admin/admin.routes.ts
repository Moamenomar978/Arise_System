import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent) },
  { path: 'quests', loadComponent: () => import('./quest-management/quest-management.component').then(m => m.QuestManagementComponent) },
  { path: 'analytics', loadComponent: () => import('./analytics/analytics.component').then(m => m.AnalyticsComponent) }
];
