import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ErrorComponent } from './error/error.component';
import { ErrorInterceptorService } from './services/error-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './core.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './authentication/auth.module';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [AppRoutingModule, CoreModule, PostModule, AuthModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent],
})
export class AppModule {}
