import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './authentication/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.autoAuthUser();
  }

  ngOnDestroy(): void {}
  title = 'mean-course';
}
