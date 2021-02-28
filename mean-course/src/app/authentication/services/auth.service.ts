import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserDto } from 'src/dto/IUser.dto';
import { IUserResponse } from 'src/dto/IUserReposnse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private static readonly url = `${environment.serverUrl}/api/user`;
  private token = '';

  constructor(private httpClient: HttpClient) {}

  createUser(email: string, password: string): void {
    const authData: IUserDto = {
      email: email,
      password: password,
    };

    this.httpClient
      .post(`${AuthService.url}/signup`, authData)
      .subscribe((response) => {
        console.log(response);
      });
  }

  loginUser(email: string, password: string) {
    const authData: IUserDto = {
      email: email,
      password: password,
    };

    this.httpClient
      .post<IUserResponse>(`${AuthService.url}/login`, authData)
      .subscribe((response) => {
        this.token = response.token;
      });
  }

  get Token() {
    return this.token;
  }
}
