import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { TweetsService } from '../services/tweets.service';

interface TUser{
  userName:string
}

@Component({
  selector: 'app-tweet-header',
  templateUrl: './tweet-header.component.html',
  styleUrls: ['./tweet-header.component.css']
})
export class TweetHeaderComponent implements OnInit {

  condition : boolean = false;
  searchText : any;
  users:TUser[]|null=null;
  codeValue:any;
  searchUname: any;
  searchResult: any;
  myTweetBool: boolean = false;
  filteredOptions: string[] = [];
  searchOption: any = '';
  constructor(private loginService:LoginService, private route:Router,private tweetservice:TweetsService) { }

  ngOnInit(): void {
    this.loginService.getAllUsers().subscribe((data)=>{
      this.users=data;
    })

    if(localStorage.getItem('role')!=''){
    this.condition = true;
    }
  }

  onSearch(f:NgForm){
    this.tweetservice.getUserByUserName(f.value.userName).subscribe((data)=>{
      localStorage.setItem('tempUserName',f.value.userName);
      this.route.navigate(['./profile']);
    })
  }

  onProfileClick(){
    localStorage.removeItem('tempUserName');
  }


  logout(){
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('tempUserName');
  }

}
