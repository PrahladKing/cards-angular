import { Routes } from '@angular/router';
import { authRedirectGuard, loginGuard } from './shared/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'signin',
    loadComponent: () => import('./features/authentication/signin/signin.component').then((m) => m.SigninComponent),
    canActivate: [authRedirectGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/layout/layout').then((m) => m.Layout),
    canActivate: [loginGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./core/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'fire',
        loadComponent: () => import('./core/fire/fire').then((m) => m.Fire),
      },
      {
        path: 'room/:code',
        loadComponent: () =>
          import('./core/game-room/game-room.component').then((m) => m.GameRoomComponent),
      },
    ]
  },
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () => import('./core/not-found/not-found-component').then((m) => m.NotFoundComponent),
  },
];
