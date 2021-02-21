import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserDto } from 'src/dto/IUser.dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private static readonly url = `${environment.serverUrl}/api/user`;

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
}
