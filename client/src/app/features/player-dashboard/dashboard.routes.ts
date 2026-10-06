import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview', loadComponent: () => import('./overview/overview.component').then(m => m.OverviewComponent) },
  { path: 'daily-quests', loadComponent: () => import('./daily-quests/daily-quests.component').then(m => m.DailyQuestsComponent) },
  { path: 'quest-board', loadComponent: () => import('./quest-board/quest-board.component').then(m => m.QuestBoardComponent) },
  { path: 'stats', loadComponent: () => import('./stat-allocation/stat-allocation.component').then(m => m.StatAllocationComponent) },
  { path: 'achievements', loadComponent: () => import('./achievements/achievements.component').then(m => m.AchievementsComponent) },
  { path: 'shop', loadComponent: () => import('./shop/shop.component').then(m => m.ShopComponent) }
];
