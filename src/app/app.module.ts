import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { ChatComponent } from './chat/chat.component';
import { ChatroomComponent } from './chat/chatroom-list/chatroom/chatroom.component';
import { ChatwindowComponent } from './chat/chatwindow/chatwindow.component';
import { ChatroomListComponent } from './chat/chatroom-list/chatroom-list.component';
import { ChatroomDialogComponent } from './chat/chatroom-dialog/chatroom-dialog.component';
import { ChatFeedComponent } from './chat/chatwindow/chat-feed/chat-feed.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ScrollingModule }


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    HeaderComponent,
    ChatComponent,
    ChatroomComponent,
    ChatwindowComponent,
    ChatroomListComponent,
    ChatroomDialogComponent,
    ChatFeedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
