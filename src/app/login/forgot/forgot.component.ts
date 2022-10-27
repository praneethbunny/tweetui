import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  username: any;
  password: any;
  confirmPassWord: any;
  disabledButton: boolean = true;
  maxHeight:any = window.innerHeight - 200;
  inputFormValues:any ={};
  flagForPassWord: boolean = false;
  constructor(private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public dataDialog: any,
    private loginService: LoginService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  changePassWord() {
    inputFiels:{}
    this.loginService.forgot(this.inputFormValues.username).subscribe((result) => {
      if(result){
        this.dialogRef.close();
        this.toastr.success("Successfully Passwword changed..","Forgot Password")
      }
    },
      err => {
        console.log(err.error.message);
        this.toastr.error(err.error.message,"Forgot Password")
      })
  }

  cancel() {
    this.dialogRef.close({ event: 'closeButton' });
  }
  checkPassWord(){
    if(this.inputFormValues.password != undefined 
      && this.inputFormValues.confirmPassWord != undefined
      && this.inputFormValues.password === this.inputFormValues.confirmPassWord){
        this.flagForPassWord = false
      }
      else{
        this.flagForPassWord = true;
      }
  }

}

