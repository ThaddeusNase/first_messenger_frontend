import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { timeStamp } from 'console';
import { exhaustMap, map } from 'rxjs/operators';
import { Chatroom } from 'src/app/shared/chatroom.model';
import { User } from 'src/app/shared/user.model';
import { UserResponseData, UsersService } from 'src/app/shared/users.service';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chatwindow',
  templateUrl: './chatwindow.component.html',
  styleUrls: ['./chatwindow.component.css']
})
export class ChatwindowComponent implements OnInit {

  chatroom: Chatroom;
  chatpartner: User;

  // TODO: in chatservice -> determin if a chatroom has more then 2 members (then its a group) 
  // otherwise chatpartner = einen Wert geben  


  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    private userService: UsersService
  ) {}


  ngOnInit() {

    
    
  }

}
