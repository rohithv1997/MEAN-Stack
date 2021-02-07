import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public isLoading = false;
  public form!: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, {
        validators: [Validators.required],
      })
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

    console.log(this.form.value);

    this.form.reset();
  }
}
