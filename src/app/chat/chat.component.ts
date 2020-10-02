import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { SessionService } from '../auth/session.service';
import { ChatService } from './chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private sessionService: SessionService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.autologin()
    this.sessionService.setupSocketConnection()
  }

  onCreateSession() {
    // this.sessionService.getSession() für chat service
  }




}
