import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

const AUTH_URLS = ['/auth/login', '/auth/register', '/auth/refresh'];

const withToken = (req: HttpRequest<unknown>, token: string | null) =>
  token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const isAuthCall = AUTH_URLS.some(u => req.url.includes(u));

  return next(withToken(req, authService.getToken())).pipe(
    catchError(err => {
      // Expired access token: get a new one and repeat the request once
      if (err.status === 401 && !isAuthCall && localStorage.getItem('arise_refresh_token')) {
        return authService.refresh().pipe(
          switchMap(res => next(withToken(req, res.accessToken))),
          catchError(refreshErr => {
            authService.logout();
            return throwError(() => refreshErr);
          })
        );
      }
      if (err.status === 401 && !isAuthCall) {
        authService.logout();
      }
      return throwError(() => err);
    })
  );
};
