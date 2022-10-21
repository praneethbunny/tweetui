import { Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faComment, faCommentDots, faCommenting, faHeart, faPenToSquare, faReply, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { TweetsService } from '../services/tweets.service';

interface Tweet{
  tId:string;
  tweet:string;
  userName:string;
  createdDate:string;
  reply:TweetReply[];
  likes:string[];
}

interface TweetReply{
  reply:string;
	userName:string;
	replyDate:string;
}


@Component({
  selector: 'app-tweet-profile',
  templateUrl: './tweet-profile.component.html',
  styleUrls: ['./tweet-profile.component.css']
})
export class TweetProfileComponent implements OnInit,OnChanges {
  tweets: any;
  tweetDao:any;
  tweetsDao:any;
  canLike:boolean=true;
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
  editProfileBool=false;
  userName:any=localStorage.getItem('tempUserName');
  username:any=localStorage.getItem('username');
  user:any;
  constructor(private route:Router,private tweetservice:TweetsService) { }

  ngOnInit(): void {
    if(this.userName==null){
      this.userName=localStorage.getItem('username');
    }
    this.getUserProfile();
    this.getTweetsByUserName();
  }

  ngOnChanges(): void{
    this.ngOnInit();
  }

  getUserProfile(){
    this.tweetservice.getUserByUserName(this.userName).subscribe((data)=>{
      this.user=data;
      console.log(this.user);
    })
  }

  getTweetsByUserName(){
    this.tweetservice.getAllTweetsByUser(this.userName).subscribe((data)=>{
      this.tweets=data;
      this.manipulate();
      console.log(this.tweets);
    })
  }

  onEditClick(){
    this.editProfileBool=!this.editProfileBool;
  }

  onEdit(user:any){
    console.log(user);
    this.tweetservice.editUserProfile(user).subscribe((data)=>{
      this.user=data;
      this.editProfileBool=false;
    })
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
    console.log(this.tweets)
  }


}
