import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { UserService } from 'src/app/services/userservices/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  userid:string
  user = {
    UserName: '',
    Password: '',
  }
  emailPattern = "^[a-z0-9.%+-]+@[a-z.-]+\.[a-z]{2,4}$";

  constructor(private router: Router, public snackbar: MatSnackBar, public userService: UserService) { }

  ngOnInit() {
    this.userid = localStorage.getItem('userId');
    
  }
  /**
     * Method to hold the information in form
     * @param form 
     */
  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();
    this.user =
      {
        UserName: '',
        Password: '',
      }
  }

  /**
   * Submit method to pass information for user to login
   * @param form 
   */
  onSubmit(form: NgForm) {
    if (form.value.UserName == '' && form.value.Password == '') {
      this.snackbar.open("Invalid UserName or Password", "close", { duration: 2000 });
    }
    else {
      console.log("in signin",form.value);
      
      this.userService.signin(form.value).subscribe
        ((data: any) => {
          console.log(data);
          localStorage.setItem("token",data.token)
          localStorage.setItem("userId",data.userid)
         this.userid= localStorage.getItem('userId')


          this.userService.getProfile(this.userid).subscribe(data=>{
            //console.log(data.user.role);
            console.log(data['user'].role);
      
            if(data['user'].role =='Manager'){
            this.router.navigateByUrl('dashboard');}
      
            else if(data['user'].role =='Analyst'){
            this.router.navigateByUrl('analyst');}
      
            else if(data['user'].role =='sales'){
            this.router.navigateByUrl('sales');}
      
            else if(data['user'].role =='Operations'){
            this.router.navigateByUrl('operations');}
      
            else{
            this.router.navigateByUrl('dashboard');}
            })
          // this.router.navigateByUrl('dashboard');
          this.snackbar.open("login successful  ", "close", { duration: 2000 });
        },
          error => {
            console.log(error);
            this.snackbar.open("Entered wrong username Or password", "close", { duration: 2500 })
          }
        );
    }
  }
}