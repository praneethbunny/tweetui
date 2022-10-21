import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faComment, faCommentDots, faCommenting, faHeart, faPenToSquare, faReply, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { TweetsService } from '../services/tweets.service';

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

interface TweetDAO{
  tId:string;
  tweet:string;
  userName:string;
  createdDate:string;
  reply:TweetReply[];
  likes:string[];
  likeCount:number;
}

@Component({
  selector: 'app-tweet-body',
  templateUrl: './tweet-body.component.html',
  styleUrls: ['./tweet-body.component.css']
})
export class TweetBodyComponent implements OnInit {
  tweets: any;
  tweetDao:any;
  tweetsDao:any;
  users: UserDAO[]|null=null;
  replys:TweetReply[]|null=null;
  canLike:boolean=true;
  username:any=localStorage.getItem('username');
  addTweetMessage:any;
  invalidAddTweet:boolean=false;
  disableButton: boolean = true;
  items: string[] = [];
  editIcon = faPenToSquare;
  replyIcon = faCommentDots;
  likeIcon = faHeart;
  deleteIcon = faTrash;
  profileIcon = faUser;
  editBool=false;
  deleteBool=false;
  constructor(private route:Router, private tweetservice:TweetsService) { }

  ngOnInit(): void {
    this.getAllTweets();
  }

  getAllTweets(){
    this.tweetservice.getAllTweets().subscribe((data)=>{
      this.tweets=data;
      this.manipulate();
    },
    error=>{console.log(error)});
  }

  manipulate(){
    this.editBool=false;
    this.deleteBool=false;
    for(let i=0;i<this.tweets.length;i++){
      this.tweets[i].replyBool=false;
      this.tweets[i].canLike=true;
      this.tweets[i].canEdit=false;
        this.tweets[i].canDelete=false;
      this.tweets[i].likeCount=this.tweets[i].likes.length;
      this.tweets[i].replyCount=this.tweets[i].reply.length;
      this.tweets[i].createdDate=this.tweets[i].createdDate.substring(0,16);
        if(this.tweets[i].userName.trim()==this.username?.trim()){
        this.tweets[i].canLike=false;
        this.tweets[i].canEdit=true;
        this.tweets[i].canDelete=true;
        }
        for(let j=0;j<this.tweets[i].reply.length;j++){
        this.tweets[i].reply[j].replyDate=this.tweets[i].reply[j].replyDate.substring(0,16);
        }
        for(let k=0;k<this.tweets[i].likes.length;k++){
          if(this.tweets[i].likes[k].trim()==this.username?.trim())
          this.tweets[i].canLike=false;
        }
    }
    this.tweets.reverse;
    console.log(this.tweets)
  }

  onReplyClick(tweet:any){
    for(let i=0;i<this.tweets.length;i++){
        if(this.tweets[i].tId.trim()==tweet.tId.trim())
        this.tweets[i].replyBool=!this.tweets[i].replyBool;
    }
  }

  onLikeClick(tweet:any){
    let id=tweet.tId;
    this.tweetservice.likeTweet(id).subscribe((data)=>{
      this.tweets=data;
      this.manipulate();
    },
    error=>{console.log(error)});
  }

  addTweet(){
    let tweet=this.addTweetMessage;
    this.checkTweet();
    this.tweetservice.addNewTweet({tweet}).subscribe((data)=>{
      this.tweets=data;
      this.manipulate();
      this.addTweetMessage=null;
    },
    error=>{console.log(error)});
  }

  addReply(t:Tweet){
    let reply=this.addTweetMessage;
    let id=t.tId
    this.checkTweet();
    this.tweetservice.replyTweet(id,{reply}).subscribe((data)=>{
      this.tweets=data;
      this.manipulate();
      this.addTweetMessage=null;
    },
    error=>{console.log(error)});
  }

  updateTweetClick(t:Tweet){
    this.editBool=!this.editBool;
    this.addTweetMessage=t.tweet;
  }

  updateTweet(t:Tweet){
    let tId=t.tId;
    let tweet=this.addTweetMessage;
    this.checkTweet();
    this.tweetservice.updateTweet({tId,tweet}).subscribe((data)=>{
      this.tweets=data;
      this.manipulate()
    },
    error=>{console.log(error)});
  }
  deleteTweetClick(){
    this.deleteBool=!this.deleteBool;
  }

  deleteTweet(t:Tweet){
    let tId=t.tId;
    this.tweetservice.deleteTweet(tId).subscribe((data)=>{
      this.tweets=data;
      this.manipulate()
    },
    error=>{console.log(error)});
  }

  onProfileClick(username:string){
    localStorage.setItem('tempUserName',username);
    this.route.navigate(['./profile']);
  }

  checkTweet(){
    if(this.addTweetMessage.length >= 144){
      this.invalidAddTweet = true;
    }
    else{
      this.invalidAddTweet = false;
    }
  }
  onchangeTweet() {
    if (this.addTweetMessage != undefined && this.addTweetMessage != null 
      && this.addTweetMessage.length > 0) {
      this.disableButton = false;
    }
    else{
      this.disableButton = true;
    }
  }


}
