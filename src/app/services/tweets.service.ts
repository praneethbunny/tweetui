import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders  } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface UserDAO{
  userName:string;
  firstName:string;
  lastName:string;
  emailId:string;
  contactNo:String;
}

interface TweetReply{
  reply:string;
	userName:string;
	replyDate:string;
}

interface Tweet{
  tId:string;
  tweet:string;
  userName:string;
  createdDate:string;
  reply:TweetReply[];
  likes:string[];
}

@Injectable({
  providedIn: 'root'
})
export class TweetsService {

  constructor(private http: HttpClient, private router: Router) { }

  getAllUsers(){
    let  tokens:string='Bearer '+localStorage.getItem('token');
    const headers=new HttpHeaders().set('Authorization',tokens);
    return this.http.get<UserDAO[]>('http://localhost:8081/api/v1.0/tweets'+'/users/all',{headers});
  }

  getUserByUserName(id:string){
    let  tokens:string='Bearer '+localStorage.getItem('token');
    const headers=new HttpHeaders().set('Authorization',tokens);
    return this.http.get<any>('http://localhost:8081/api/v1.0/tweets'+'/user/search/'+id,{headers});
  }

  getAllTweets(){
    let  tokens:string='Bearer '+localStorage.getItem('token');
    const headers=new HttpHeaders().set('Authorization',tokens);
    return this.http.get<Tweet[]>('http://localhost:8083/api/v1.0/tweets'+'/all',{headers});
  }

  getAllTweetsByUser(username:string){
    let  tokens:string='Bearer '+localStorage.getItem('token');
    const headers=new HttpHeaders().set('Authorization',tokens);
    return this.http.get<Tweet[]>('http://localhost:8083/api/v1.0/tweets/'+username,{headers});
  }

  editUserProfile(inputFields:{userName:string,firstName:string,lastName:string,emailid:string,contactNo:string}){
    let  tokens:string='Bearer '+localStorage.getItem('token');
    const headers=new HttpHeaders().set('Authorization',tokens);
    return this.http.post<Tweet[]>('http://localhost:8081/api/v1.0/tweets/'+inputFields.userName+"/edit",inputFields,{headers});
  }

  addNewTweet(inputFields:{tweet:string}){
    let username=localStorage.getItem('username');
    let  tokens:string='Bearer '+localStorage.getItem('token');
    const headers=new HttpHeaders().set('Authorization',tokens);
    return this.http.post<Tweet[]>('http://localhost:8083/api/v1.0/tweets/'+username+'/add',inputFields,{headers})
  }

  updateTweet(inputFields:{tId:string,tweet:string}){
    let id=inputFields.tId;
    let username=localStorage.getItem('username');
    let  tokens:string='Bearer '+localStorage.getItem('token');
    const headers=new HttpHeaders().set('Authorization',tokens);
    return this.http.put<Tweet[]>('http://localhost:8083/api/v1.0/tweets/'+username+'/update/'+id,inputFields,{headers})
  }

  deleteTweet(id:string){
    let username=localStorage.getItem('username');
    let  tokens:string='Bearer '+localStorage.getItem('token');
    const headers=new HttpHeaders().set('Authorization',tokens);
    return this.http.delete<Tweet[]>('http://localhost:8083/api/v1.0/tweets/'+username+'/delete/'+id,{headers})
  }

  likeTweet(id:string){
    let username=localStorage.getItem('username');
    let  tokens:string='Bearer '+localStorage.getItem('token');
    const headers=new HttpHeaders().set('Authorization',tokens);
    return this.http.put<Tweet[]>('http://localhost:8083/api/v1.0/tweets/'+username+'/like/'+id,{},{headers})
  }

  replyTweet(id:string,inputFields:{reply:string}){
    let username=localStorage.getItem('username');
    let  tokens:string='Bearer '+localStorage.getItem('token');
    const headers=new HttpHeaders().set('Authorization',tokens);
    return this.http.post<Tweet[]>('http://localhost:8083/api/v1.0/tweets/'+username+'/reply/'+id,inputFields,{headers})
  }

  trending(){
    let username=localStorage.getItem('username');
    let  tokens:string='Bearer '+localStorage.getItem('token');
    const headers=new HttpHeaders().set('Authorization',tokens);
    return this.http.get<Tweet[]>('http://localhost:8083/api/v1.0/tweets/trending',{headers})
  }


  

}
