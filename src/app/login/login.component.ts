import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../services/login.service';
import { ForgotComponent } from './forgot/forgot.component';
import { RegisterComponent } from './register/register.component';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isValidating: boolean = false;
  isLoading: boolean = false;
  loginCondition: boolean = true;
  signUpCondition: boolean = false;
  forgotCondition: boolean = false;
  matchCondition: boolean = false;
  error = null;
  userSubscription: Subscription = new Subscription();

  constructor(private authService: LoginService, private router: Router,
     private dialog: MatDialog, private toastr: ToastrService) {}
  ngOnInit() {
    this.userSubscription = this.authService.user.subscribe((user) => {
      if (user) {
        this.router.navigate(['./']);  
      }
    });

  }

  ngOnDestroy(){
    this.userSubscription.unsubscribe();
  }

  onLogin(){
    this.loginCondition = true;
    this.forgotCondition = false;
    this.signUpCondition = false;
  }

  onForgot(){
    this.loginCondition = false;
    this.forgotCondition = true;
    this.signUpCondition = false;
    
  }

  onSignup(){
    this.loginCondition = false;
    this.forgotCondition = false;
    this.signUpCondition = true;
  }

  login(username: string, password: string) {
    this.isValidating = true;
    this.authService.login( {username, password} ).subscribe(
      (response) => {
        console.log(response)
        this.isValidating = false;
        this.error = null;
        if(localStorage.getItem('role')=='user'){
        this.router.navigate(['./admin']);
      }
      else{
        this.router.navigate(['./']);
      }
      },
      (errorMessage) => {
        this.isValidating = false;
        this.error = errorMessage;
      }
    );
  }

  onSubmit(form: NgForm) {
    const username = form.value.username;
    const password = form.value.password;
    this.isValidating = true;
    this.login(form.value.username,form.value.password);
    form.reset();
  }



  onSubmitForgot(form:NgForm){
    const userName = form.value.username;
    const password = form.value.password;
    const confirmPassword= form.value.confirmPassword;
    this.isValidating = true;
    if(password.trim()===confirmPassword.trim()){
    this.isValidating = true;
    this.authService.forgot({userName,password}).subscribe(
      (response)=>{
        this.login( userName, password );
        this.isValidating = false;
        this.error = null;
      },
      (errorMessage) => {
        this.isValidating = false;
        this.error = errorMessage;
      });
    }else{
      this.isValidating = false;
      this.matchCondition = true;
    }
    form.reset();
  }

  onSubmitRegister(form:NgForm){
    const userName = form.value.userName;
    const firstName = form.value.firstName;
    const lastName = form.value.lastName;
    const emailId = form.value.emailId;
    const contactNo = form.value.contactNo;
    const password = form.value.password;
    const confirmPassword= form.value.confirmPassword;
    this.isValidating = true;
    if(password.trim()===confirmPassword.trim()){
     this.isValidating = true;
     this.authService.register({userName, firstName, lastName, emailId, contactNo, password}).subscribe(
      (response)=>{
        this.login( userName, password );
        this.isValidating = false;
        this.error = null;
      },
      (errorMessage) => {
        this.isValidating = false;
        this.error = errorMessage;
      });
    }else{
      this.isValidating = false;
      this.matchCondition = true;
    }
    form.reset();
  }

  

  handleError() {
    this.error = null;
  }
  
  }

