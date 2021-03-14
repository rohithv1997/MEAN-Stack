import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { IAuthDto } from 'src/dto/IAuth.dto';
import { IUserDto } from 'src/dto/IUser.dto';
import { IUserResponse } from 'src/dto/IUserReposnse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private static readonly url = `${environment.serverUrl}/api/user`;
  private token!: string | null;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer!: NodeJS.Timeout;
  private userId!: string | null;

  constructor(private httpClient: HttpClient, private router: Router) {}

  createUser(email: string, password: string): void {
    const authData: IUserDto = {
      email: email,
      password: password,
    };

    this.httpClient.post(`${AuthService.url}/signup`, authData).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/']);
      },
      (error) => {
        console.log(error);
        this.authStatusListener.next(false);
      }
    );
  }

  loginUser(email: string, password: string) {
    const authData: IUserDto = {
      email: email,
      password: password,
    };

    this.httpClient
      .post<IUserResponse>(`${AuthService.url}/login`, authData)
      .subscribe(
        (response) => {
          this.token = response.token;
          if (response.token) {
            const expiresIn = response.expiresIn;
            this.loginImpl(expiresIn, response.userId);
            this.saveAuthData(response);
          }
        },
        (error) => {
          console.log(error);
          this.authStatusListener.next(false);
        }
      );
  }

  private loginImpl(expiresIn: number, userId: string) {
    this.tokenTimer = setTimeout(() => {
      alert('Auto Logged out!');
      this.logout();
    }, expiresIn * 1000);
    this.isAuthenticated = true;
    this.userId = userId;
    this.authStatusListener.next(true);
    this.router.navigate(['/']);
  }

  logout(): void {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  get Token() {
    return this.token;
  }

  getAuthStatusSubscription(callback: (args: boolean) => void): Subscription {
    return this.authStatusListener.subscribe((success) => {
      callback(success);
    });
  }

  get IsAuthenticated() {
    return this.isAuthenticated;
  }

  get UserId() {
    return this.userId ? this.userId : '';
  }

  autoAuthUser() {
    const authDto = this.getAuthData();
    if (!authDto) {
      return;
    }
    const now = new Date();
    const expiresIn = authDto.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.loginImpl(expiresIn / 1000, authDto.userId);
    }
  }

  private saveAuthData(data: IUserResponse) {
    const expirationDate = new Date(
      new Date().getTime() + data.expiresIn * 1000
    );
    localStorage.setItem('token', data.token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('userId', data.userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
  }

  private getAuthData(): IAuthDto | null {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const userId = localStorage.getItem('userId');
    if (token && expirationDate && userId) {
      return {
        token: token,
        expirationDate: new Date(expirationDate),
        userId: userId,
      } as IAuthDto;
    }
    return null;
  }
}
