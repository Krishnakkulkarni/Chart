import { Injectable } from '@angular/core';
import { HttpService } from '../httpservices/http.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup, NgForm, Form } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fb: FormBuilder, public httpService: HttpService, public httpclient: HttpClient) { }

  formModel = this.fb.group({
    FullName: ['', Validators.required],
    UserName: ['', Validators.required,],
    Email: ['', [Validators.required, Validators.email]],
    Role: ['', Validators.required],
    // Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(4)]],
      ConfirmPassword: ['', Validators.required],
    }
      // , { validator: this.comparePasswords }) }
  );


  // comparePasswords(fb: FormGroup) {
  //   let confirmPswrdCtrl = fb.get('ConfirmPassword');
  //   if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
  //     if (fb.get('Password').value != confirmPswrdCtrl.value)
  //       confirmPswrdCtrl.setErrors({ passwordMismatch: true });
  //     else
  //       confirmPswrdCtrl.setErrors(null);
  //   }
  // }


  signup() {
    var body = {
      UserName: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      FullName: this.formModel.value.FullName,
      Password: this.formModel.value.Password,
      Role: this.formModel.value.Role
    };

    console.log(body);

    return this.httpService.post('Account/signup', body);
  }
  signin(data) {
    return this.httpService.post('Account/login', data);
  }
  getProfile(Id) {
    return this.httpService.Get('Account/profile/' + Id);
  }

  Manager(UserId) {
    return this.httpService.Get('Managers/' + UserId);
  }
  Sale(UserId) {
    return this.httpService.Get('Sales/' + UserId);
  }
  Operation(UserId) {
    return this.httpService.Get('Operations/' + UserId);
  }
  Analyst(UserId) {
    return this.httpService.Get('Analysts/' + UserId);
  }

  AnalystDataExcel(UserId){
    return this.httpService.Get('Analysts/excel/'+ UserId);
  }
}
