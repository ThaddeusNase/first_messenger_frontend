import { HttpErrorResponse } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, ElementRef, OnInit, Output, ViewChild, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { error } from 'console';
import { throwError } from 'rxjs';
import { exhaustMap, map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Chatroom } from 'src/app/shared/models/chatroom.model';
import { CurrentUser } from 'src/app/shared/models/currentuser.model';
import { MembershipModel } from 'src/app/shared/models/membership.model';
import { MessageModel } from 'src/app/shared/models/message.model';
import { User } from 'src/app/shared/models/user.model';
import { ChatService, MembershipsResponseData, MessageData, RoomResponseData } from '../../chat.service';

@Component({
  selector: 'app-chat-footer',
  templateUrl: './chat-footer.component.html',
  styleUrls: ['./chat-footer.component.css']
})
export class ChatFooterComponent implements OnInit {

  // TODO: @Input() chatroom -> für message service damit man nachricht korrekt versenden/speichern kann

  errorMsg: string

  @Output() messageSent = new EventEmitter<boolean>()

  author: User;
  @Input() recipient: User;     // only used for the new chatroom creation (s. chatroom.name) -> TODO: später recipient-array: damit Memberships alle 
  @Input() chatroom: Chatroom;
  @Input() initialMessage: boolean = false;

  groupMembers: User[] = []

  

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  messageForm: FormGroup

  ngOnInit() {
    this.fetchCurrentUser()
    this.messageForm = new FormGroup({
      "messageTextArea": new FormControl(null, [Validators.required]) 
    })

    if (!this.chatroom && !this.initialMessage) {
      this.fetchChatroom()
    } else {
      // wenn eine initialMessage, dann groupMembers fetchen, um via footer chatroom/memberships zu erstellen
      // TODO: eventuell refactoren -> dass die erstellung vom initialen chatroom & dessen memberships KOMPLETT via service handelt werden 
      this.fetchGroupMembers()
    }
    

    // this.initForm()
  }

  fetchGroupMembers() {
    // TODO: überarbeiten sobald group chat möglich
    if (this.initialMessage) {
      this.groupMembers.push(this.recipient)
      this.groupMembers.push(this.author)
    }
  }

  fetchChatroom() {
    this.route.paramMap.pipe(exhaustMap(
      (params) => {
        return this.chatService.getChatroomById(params.get("room"))
      }
    )).subscribe(
      (roomResData: RoomResponseData) => {
        console.log("chatroom fetched: ", roomResData);
        
        this.chatroom = new Chatroom(+roomResData, new Date(roomResData.creation_date), roomResData.name, roomResData.member_limit)
      }
    )
  }

  fetchCurrentUser() {
    this.authService.currentUser.pipe(map((currentUser: CurrentUser) => {
      const author: User = new User(currentUser.id, currentUser.email, undefined, undefined, undefined)
      return author
    })).subscribe(
      (author: User) => {
        this.author = author
      }
    )
    
  }

  initForm() {
    this.messageForm = new FormGroup({
      "messageTextArea": new FormControl(null, [Validators.required]) 
    })
  }


  onSubmit() {
    let messageData: MessageData = this.createMessageData()
    if (!messageData) {
      console.error("no message data");
      return
    }
    
    // wenn noch kein chatroom entsteht -> erstmal einen neuen room erstellen, indem die msg gespeichert werden kann
    if(this.initialMessage) {
      this.createAndJoinChatroom(messageData)
    }
     else {
      this.chatService.sendMessage(messageData)
    }
    
    console.log("submited");
    this.messageForm.reset()
    this.messageSent.emit(true)
  }


  createAndJoinChatroom(messageData: MessageData) {
      const chatroomName = `privateRoom_${this.author.id}_to_${this.recipient.id}`
      this.chatService.createNewChatroom(chatroomName, 2).pipe(
        take(1),
        exhaustMap(
          (roomResData: RoomResponseData) => {
            messageData["room_id"] = roomResData.id.toString()
            let memberIdList: number[] = this.getMemberIdList(this.groupMembers)
            return this.chatService.joinMembersToChatroom(memberIdList,roomResData.id)
          }
        )
      ).subscribe(
        (membershipsResData: MembershipsResponseData) => {
          this.chatService.sendMessage(messageData)
        }
      ), (resError: HttpErrorResponse) => {
        this.errorMsg = resError.message
        console.error(resError);
      }
  }

  createMessageData() {
    if (!this.author.id || !this.messageForm.controls.messageTextArea.value ) {
      return undefined
      // throwError("some of these values are undefined")
    }
    let messageData: MessageData = {
      room_id: this.chatroom ? this.chatroom.id.toString() : undefined,
      author_id: this.author.id,
      delivery_time: new Date(),
      content: this.messageForm.controls.messageTextArea.value
    }
    return messageData  
  }



  membersToChatroom(users: User[], room_id: number) {
    var memberIdList: number[] = this.getMemberIdList(users)
    this.chatService.joinMembersToChatroom(memberIdList, room_id).subscribe(
      (memberships: MembershipsResponseData) => {
        console.log("---memberships: ",memberships);
      }
    )
    

  }

  getMemberIdList(users:User[]) {
    var memberIdList: number[] = []
    users.forEach(user => {
      memberIdList.push(+user.id)
    })
    return memberIdList
  }



}
