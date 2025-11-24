import { Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path: '',
  //   loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent),
  // },
  {
    path: '',
    loadComponent: () => import('./components/fire/fire').then((m) => m.Fire),
  },
  {
    path: 'room/:code',
    loadComponent: () =>
      import('./components/game-room/game-room.component').then((m) => m.GameRoomComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
