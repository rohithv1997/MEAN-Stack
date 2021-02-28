import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  public isLoading = false;
  public form!: FormGroup;

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

    this.authService.createUser(
      this.form.value.email as string,
      this.form.value.password as string
    );

    this.form.reset();
  }
}
