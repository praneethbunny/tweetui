import { Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faComment, faCommentDots, faCommenting, faHeart, faPenToSquare, faReply, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.css']
})
export class TrendingComponent implements OnInit,OnChanges {

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
  constructor(private route:Router,private tweetservice:TweetsService,private toastr:ToastrService) { }

  ngOnInit(): void {
    if(this.userName==null){
      this.userName=localStorage.getItem('username');
    }
    this.getTrendingTweets();
  }

  ngOnChanges(): void{
    this.ngOnInit();
  }


  getTrendingTweets(){
    this.tweetservice.trending().subscribe((data)=>{
      this.tweets=data;
      this.manipulate();
      this.toastr.success("Loaded tweets")
    },error=>{
      this.toastr.error("Failed to load Tweets")});
  }

  onEditClick(){
    this.editProfileBool=!this.editProfileBool;
  }

  onEdit(user:any){
    console.log(user);
    this.tweetservice.editUserProfile(user).subscribe((data)=>{
      this.user=data;
      this.editProfileBool=false;
      this.toastr.success("Edited successfully");
    },error=>{
      this.toastr.error("Failed to edit Your Details")});
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
      this.toastr.success("Liked successfully");
    },
    error=>{console.log(error)
    this.toastr.error("Faield to like")});
  }

  addTweet(){
    let tweet=this.addTweetMessage;
    this.checkTweet();
    this.tweetservice.addNewTweet({tweet}).subscribe((data)=>{
      this.tweets=data;
      this.manipulate();
      this.addTweetMessage=null;
      this.toastr.success("Successfully posted Tweet");
    },
    error=>{this.addTweetMessage=null;console.log(error)
    this.toastr.error("Failed to post Tweet")});
  }

  addReply(t:Tweet){
    let reply=this.addTweetMessage;
    let id=t.tId
    this.checkTweet();
    this.tweetservice.replyTweet(id,{reply}).subscribe((data)=>{
      this.tweets=data;
      this.manipulate();
      this.addTweetMessage=null;
      this.toastr.success("Successfully replied Tweet");
    },
    error=>{this.addTweetMessage=null;console.log(error)
    this.toastr.error("Failed to reply");});
  }

  updateTweetClick(t:Tweet){
    this.editBool=!this.editBool;
    this.addTweetMessage=t.tweet;
    if(!this.editBool){
      this.addTweetMessage=null;
    }
  }

  updateTweet(t:Tweet){
    let tId=t.tId;
    let tweet=this.addTweetMessage;
    this.checkTweet();
    this.tweetservice.updateTweet({tId,tweet}).subscribe((data)=>{
      this.tweets=data;
      this.addTweetMessage=null;
      this.manipulate()
      this.toastr.success("Edited Successfully");
    },
    error=>{this.addTweetMessage=null;console.log(error);
    this.toastr.error("Failed to edit")});
  }
  deleteTweetClick(){
    this.deleteBool=!this.deleteBool;
  }

  deleteTweet(t:Tweet){
    let tId=t.tId;
    this.tweetservice.deleteTweet(tId).subscribe((data)=>{
      this.tweets=data;
      this.manipulate();
      this.toastr.success("Deleted Tweet");
    },
    error=>{console.log(error)
    this.toastr.error("Failed to delete Tweet");});
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

