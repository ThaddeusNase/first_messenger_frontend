import { BrowserModule } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { SocketIoModule, SocketIoConfig, Socket } from 'ngx-socket-io';


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
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChatHeaderComponent } from './chat/chatwindow/chat-header/chat-header.component';
import { ChatFooterComponent } from './chat/chatwindow/chat-footer/chat-footer.component';
import { UserEntryComponent } from './chat/chatroom-dialog/user-entry/user-entry.component';
import { ProfileDropdownMenuComponent } from './header/profile-dropdown-menu/profile-dropdown-menu.component';
import { ProfileComponent } from './profile/profile.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
// import { ScrollingModule }


const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };

// s. namespace-handeling in chat.service "/private"
// --- Resources: --- 
// https://github.com/rodgc/ngx-socket-io/issues/25
// https://www.npmjs.com/package/ngx-socket-io
// https://socket.io/docs/v3/namespaces/#Dynamic-namespaces




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
    ChatFeedComponent,
    ChatHeaderComponent,
    ChatFooterComponent,
    UserEntryComponent,
    ProfileDropdownMenuComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ScrollingModule,
    MatFormFieldModule,
    MatInputModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
