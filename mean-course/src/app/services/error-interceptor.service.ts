import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IErrorDto } from 'src/dto/IError.dto';
import { ErrorComponent } from '../error/error.component';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptorService implements HttpInterceptor {
  constructor(private matDialogService: MatDialog) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.matDialogService.open(ErrorComponent, {
          data: { errorResponse: error } as IErrorDto,
        });
        // console.log(error);
        return throwError(error);
      })
    );
  }
}
