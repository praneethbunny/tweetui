import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [LoginComponent,],
  imports: [
    CommonModule,
    FormsModule,
    
    RouterModule.forChild([
    ])
  ]
})
export class LoginModule { }