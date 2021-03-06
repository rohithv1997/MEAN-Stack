import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private static readonly Bearer = 'Bearer';

  constructor(private authService: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.Token;
    const authRequest = req.clone({
      headers: req.headers.set(
        'authorization',
        `${AuthInterceptorService.Bearer} ${token}`
      ),
    });
    return next.handle(authRequest);
  }
}
