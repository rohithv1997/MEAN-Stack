import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IErrorDto } from 'src/dto/IError.dto';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent implements OnInit, OnDestroy {
  public message = 'An Unknown Error Occured!';

  constructor(@Inject(MAT_DIALOG_DATA) public errorDto: IErrorDto) {
    console.log(errorDto);

    if (errorDto.errorResponse.error.message) {
      this.message = errorDto.errorResponse.error.message;
    }
  }
  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
