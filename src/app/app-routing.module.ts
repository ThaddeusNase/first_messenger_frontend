import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { AuthFormGuardService } from './auth/auth-form-guard.service';
import { ChatComponent } from './chat/chat.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { ChatwindowComponent } from './chat/chatwindow/chatwindow.component';
import { ChatroomsResolverService } from './chat/chatrooms-resolver.service';
import { OpenedChatroomResolverService } from './chat/chatwindow/openedChatroom-resolver.service';
import { ProfileComponent } from './profile/profile.component';
import { ProfileResolverService } from './profile/profile-resolver.service';


const routes: Routes = [
  {path: "auth", component: AuthComponent, canActivate: [AuthFormGuardService]},
  {path: "home", component: HomeComponent},
  {path: "chat", component: ChatComponent, canActivate: [AuthGuardService], resolve: {chatrooms: ChatroomsResolverService} , children: [
    {path: ":room", component: ChatwindowComponent, resolve: {openedChatroomData: OpenedChatroomResolverService} }
  ]},
  {path: "profile/:id", component: ProfileComponent, canActivate: [AuthGuardService], resolve: {userData: ProfileResolverService}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
