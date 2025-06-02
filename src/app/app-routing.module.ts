import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },
  { path: 'signup', loadComponent: () => import('./pages/signup/signup.page').then(m => m.SignupPage) },
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule), canActivate: [AuthGuard] },
  { path: 'update-profile', loadComponent: () => import('./pages/updateProfile/update-profile.page').then(m => m.UpdateProfilePage), canActivate: [AuthGuard] },
  { path: 'signup', loadComponent: () => import('./pages/signup/signup.page').then(m => m.SignupPage) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
