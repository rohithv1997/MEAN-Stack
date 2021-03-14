import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public isLoading = false;
  public form!: FormGroup;
  private authSubscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, {
        validators: [Validators.required],
      }),
    });

    this.authSubscription = this.authService.getAuthStatusSubscription(
      (isloading) => {
        this.isLoading = isloading;
      }
    );
  }

  get formEmail(): FormArray {
    return this.formControls('email');
  }

  get formPassword(): FormArray {
    return this.formControls('password');
  }

  private formControls(property: string): FormArray {
    return <FormArray>this.form.get(property);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    this.authService.loginUser(
      this.form.value.email as string,
      this.form.value.password as string
    );

    this.form.reset();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
