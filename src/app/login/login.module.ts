import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { ForgotComponent } from './forgot/forgot.component';



@NgModule({
  declarations: [LoginComponent,RegisterComponent, ForgotComponent],
  imports: [
    CommonModule,
    FormsModule,
    
    RouterModule.forChild([
      {path:'',component:LoginComponent},
      {path:'login',component:LoginComponent}
    ])
  ]
})
export class LoginModule { }