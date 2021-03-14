import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../authentication/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubscription: Subscription = new Subscription();
  public isUserAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.IsAuthenticated;
    this.authListenerSubscription = this.authService.getAuthStatusSubscription(
      (isAuthenticated) => {
        this.isUserAuthenticated = isAuthenticated;
      }
    );
  }

  ngOnDestroy(): void {
    this.authListenerSubscription.unsubscribe();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
