import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { AuthFormGuardService } from './auth/auth-form-guard.service';
import { ChatComponent } from './chat/chat.component';
import { AuthGuardService } from './auth/auth-guard.service';


const routes: Routes = [
  {path: "auth", component: AuthComponent, canActivate: [AuthFormGuardService]},
  {path: "home", component: HomeComponent},
  {path: "chat", component: ChatComponent, canActivate:[AuthGuardService], children: [
    // :room == SocketIO session id
    // {path: ":room", component: ChatRoomComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
