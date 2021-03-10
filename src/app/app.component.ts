import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Url } from 'url';
import { ChatService } from './chat/chat.service';
import { ChatroomDialogComponent } from './chat/chatroom-dialog/chatroom-dialog.component';
import { SessionService } from './auth/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  onAuthRoute = false // to hide header, wenn user auf "/auth" Page/route ist
  constructor(
    public router: Router, 
    private chatservice: ChatService,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.sessionService.updatedSessionId.subscribe(
      (newSid: string) => {
        this.sessionService.createSession()
        console.log("EXECUTED SOCKET IO ");
        console.log("--- session_id upadated (reconnection of Socketio): ", newSid);
        
      }
    )

  }
}
