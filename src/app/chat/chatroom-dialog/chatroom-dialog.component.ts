// TODO: 
// in chatroom list alle chatrooms fetchen in der user eine membership hat -> neue Resource in Flask anlegen
// contact suche mit input&form -> get_all_users request -> später get all contacts
// 



import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldControl, MAT_DIALOG_DATA } from '@angular/material';
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Chatroom } from 'src/app/shared/chatroom.model';
import { User } from 'src/app/shared/user.model';
import { ChatService, MembershipResponseData } from '../chat.service';
import { RoomResponseData } from "../chat.service"

@Component({
  selector: 'app-chatroom-dialog',
  templateUrl: './chatroom-dialog.component.html',
  styleUrls: ['./chatroom-dialog.component.css']
})
export class ChatroomDialogComponent implements OnInit {

  chatroomForm: FormGroup;
  newChatroom: Chatroom;

  @Output() closeEvent = new EventEmitter()
  @Output() saveEvent = new EventEmitter<Chatroom>()

  formError: string = "";
  requestError: string;

  tokenExpirationTimer: any;

  constructor(
    private formBuilder: FormBuilder,
    private chatService: ChatService,
    private authService: AuthService
    // @Inject(MAT_DIALOG_DATA) public data: {name: string}, // @Inject... public data benötigt, wenn wir zB datten von chatroom-list in chatroom-dialog übergeben wollen
  ) { }

  ngOnInit() {
    console.log("chatroom dialog initiated");
    
    this.chatroomForm = this.formBuilder.group({
      "roomName": ["", [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      // TODO: wenn button  gedrückt -> dann zusätzliches *selecting only dropdown-input-field* ausklappen  customMemberLimit: ["", []]
    }) 
  } 

  onSubmit() {
    // TODO: Member/Kontakte hinzufügen!  memberLimit 
    if (this.chatroomForm.invalid) {
      console.log("chatroomForm not valid");
      console.log(this.chatroomForm);
      this.formError = this.getChatroomFormErrors(this.chatroomForm.controls.roomName.errors)
    } else {
      this.createRoomAndJoin()
      // this.saveEvent.emit() befindet sich in createRoomAndJoin() method, da erst geprüft werden muss,
      // ob fehler this.chatservice.createNewChatroom() ODER this.chatservice.joinChatroom
      // erst dann fenster schließen ansonsten fehlermeldung in Chatroom-dialog.component(.html) s. this.requestError
    }
  }


  createRoomAndJoin() {

    const userData: {
      email: string,
      id: number,
      _token: string,
      _expirationDate: string
    } = JSON.parse(localStorage.getItem("userData"))

    var roomData: RoomResponseData = null;

    this.chatService.createNewChatroom(this.chatroomForm.value.roomName).pipe(
      take(1),
      exhaustMap(
        (roomResData: RoomResponseData) => {
        console.log("---room-id: " ,roomResData.id, "user_id: ", userData.id);
        roomData = roomResData;
        const tmpNewChatroom = new Chatroom(roomResData.id, new Date(roomResData.creation_date), roomResData.name)
        this.newChatroom = tmpNewChatroom
        return this.chatService.joinChatroom(userData.id ,roomResData.id)
        }
      )
    ).subscribe(
      (membershipResData: MembershipResponseData) => {
        console.log(membershipResData);
        this.saveEvent.emit(this.newChatroom)
      },
      (err: string) => {
        this.requestError = err
        console.log("---membership-post-request error: ",err);
        this.errorMessageAnimtationTime()
        // TODO: error animation
        // MARK: wenn createNewCHatroom failed -> dann bereits erstellten chatroom wieder löschen
        if (roomData) {
          console.log("---roomData: ", roomData);
          
          this.chatService.deleteChatroom(roomData.id.toString()).subscribe(
            () => {
              console.log(`chatroom ${roomData.name} with id: ${roomData.id} deleted`);
            }
          )
        }
      }

    )
  } 



  onClose() {
    this.closeEvent.emit()
  }


  // TODO: eventuell als getChatroomControlErros() umbenennen und die Chatroom.control als Parameter übergebn  und nicht den error -> den erst dann in methode handeln
  getChatroomFormErrors(errors) {
    var errorMsg = ""

    if (typeof errors.required !== "undefined") {
      errorMsg = "Chatroom Name must not be empty"
    } else if ( typeof errors.minlength !== "undefined") {
      errorMsg = "Chatroom Name requires at least 3 characters"
    } else if (typeof errors.maxlength !== "undefined") {
      errorMsg = "Chatroom Name can only consist of 40 characters maximum "
    } else {
      errorMsg = "Unknown error of Chatroom Form"
    }
    return errorMsg
  }

  // damit errorMessage animation auch wieder nach 3s dismissed 
  errorMessageAnimtationTime() {
    this.tokenExpirationTimer = setTimeout(() => {
      this.requestError = null
      if (this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer)
        this.tokenExpirationTimer = null
      }
    }, 3000)
  }


  






}
