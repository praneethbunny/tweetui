import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TweetBodyComponent } from './tweet-body/tweet-body.component';
import { TweetProfileComponent } from './tweet-profile/tweet-profile.component';
const routes: Routes = [
  {path:'',component: LoginComponent},
  {path:'tweet',component:TweetBodyComponent},
  {path:'profile',component:TweetProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
