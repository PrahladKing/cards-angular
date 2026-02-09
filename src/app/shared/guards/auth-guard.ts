import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  return true;
};


export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  if (!authService.isAuthenticated()) {
    return inject(Router).createUrlTree(["/", "signin"]);  // Redirects to the sign-in page
  }
  return true;  // Allows access to the route
};

export const authRedirectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isAuthenticated()) {
    return true;  // Allows access to the route if not logged in
  } else {
    router.navigate(['/admin']);  // Redirects logged-in users to /admin
    return false;  // Prevents access to the route
  }
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  if (!authService.isAdmin()) {
    return inject(Router).createUrlTree(["/admin"]);  // Redirects to the admin page
  }
  return true;  // Allows access to the route
};