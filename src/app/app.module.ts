import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { ToastrModule } from 'ngx-toastr';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { MentionModule } from 'angular-mentions';
import { MatInputModule } from '@angular/material/input'
import { MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AlertComponent } from './shared/alert/alert.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { TweetHeaderComponent } from './tweet-header/tweet-header.component';
import { TweetBodyComponent } from './tweet-body/tweet-body.component';
import { TweetProfileComponent } from './tweet-profile/tweet-profile.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AlertComponent,
    LoadingSpinnerComponent,
    TweetHeaderComponent,
    TweetBodyComponent,
    TweetProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    MatAutocompleteModule,
    ToastrModule.forRoot(), 
    MentionModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    ReactiveFormsModule,
  HttpClientModule,
  MatButtonModule,
  MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library:FaIconLibrary){
    library.addIconPacks(fas,far)
  }
 }
