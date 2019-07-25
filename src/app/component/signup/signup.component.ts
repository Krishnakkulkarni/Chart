import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/userservices/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

export interface Roles {
  value: any
  viewValue: any
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  Role: Roles[] = [
    { value: 'Manager', viewValue: 'Manager' },
    { value: 'Analyst', viewValue: 'Analyst' },
    { value: 'sales', viewValue: 'sales' },
    { value: 'operations', viewValue: 'operations' }
  ];

  emailPattern = "^[a-z0-9.%+-]+@[a-z.-]+\.[a-z]{2,4}$";

  constructor(private userService: UserService, private router: Router, public snackbar: MatSnackBar) { }

  ngOnInit() {
    this.userService.formModel.reset();
  }

  /**
   * 
   * @param form 
   */
  onSubmit() {
    this.userService.signup().subscribe
      ((data: any) => {
        console.log(data);
        
        if (data.Password != data.ConfirmPassword) {
          this.snackbar.open('Password and ConfirmPassword Missmatch', 'close', { duration: 2000 });
        }
        else if (data.UserName== '' && data.Password== '' && data.Email== ''){
          this.router.navigateByUrl('signup');
          this.snackbar.open('Password and ConfirmPassword Missmatch', 'close', { duration: 2000 });
        }

        else if (data.succeeded == true){
          this.router.navigateByUrl('signin');
          this.snackbar.open("register successful", "close", { duration: 2000 });
        }
      }
      );
  }

}
