// TODO: 
// in chatroom list alle chatrooms fetchen in der user eine membership hat -> neue Resource in Flask anlegen
// contact suche mit input&form -> get_all_users request -> später get all contacts
// 



import { Component, Inject, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatFormFieldControl, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Chatroom } from 'src/app/shared/models/chatroom.model';
import { ChatroomEntryModel } from 'src/app/shared/models/chatroomEntry.model';
import { CurrentUser } from 'src/app/shared/models/currentuser.model';
import { User } from 'src/app/shared/models/user.model';
import { FilteredUsersResponseData, UserResponseData, UsersService } from 'src/app/shared/services/users.service';
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
  chatPartners: User[] = []
  // commonMemberships: MembershipResponseData[] = []       -> jetzt in 
  filteredUsers: User[] = [];
  contactSelected = false;
  selectedUser: User;
  currentUser: CurrentUser;

  fetchFilteredUsersSubscribtion: Subscription

  @Output() closeEvent = new EventEmitter()
  @Output() saveEvent = new EventEmitter<ChatroomEntryModel>()

  searchUserForm: FormGroup; 

  formError: string = "";
  requestError: string;

  tokenExpirationTimer: any;

  constructor(
    private formBuilder: FormBuilder,
    private chatService: ChatService,
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router
    // @Inject(MAT_DIALOG_DATA) public data: {name: string}, // @Inject... public data benötigt, wenn wir zB datten von chatroom-list in chatroom-dialog übergeben wollen
  ) { }

  ngOnInit() {
    this.fetchCurrentUser()
    this.initSearchUserForm()
    this.fetchChatPartners()
    this.getFilteredUser()
    // this.chatroomForm = this.formBuilder.group({
    //   "roomName": ["", [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
    //   // TODO: wenn button  gedrückt -> dann zusätzliches *selecting only dropdown-input-field* ausklappen  customMemberLimit: ["", []]
    // })
  }

  
  fetchCurrentUser() {
    this.authService.currentUser.subscribe(
      (currUser: CurrentUser) => {
        this.currentUser = currUser
      }
    )
  }
    
    initSearchUserForm() {
      this.searchUserForm = new FormGroup({
        "searchTerm": new FormControl(null)
      })
    }
    

    fetchChatPartners() {
      this.chatService.getAllChatpartners(+this.currentUser.id).subscribe(
        (fetched_partners: User[]) => {
          this.chatPartners = fetched_partners
        }
      )
    }
    

    // TODO: eventuell user auch mit websockets fetchen: (effizienter als via http requests?)
    getFilteredUser() {
      this.searchUserForm.get("searchTerm").valueChanges.subscribe(
        (searchTerm: string) => {
        if (searchTerm.length !== 0) {
          this.fetchFilteredUsersSubscribtion = this.usersService.fetchFilteredUsers(searchTerm).subscribe(
            (filteredUsersResData: FilteredUsersResponseData) => {
              if (filteredUsersResData["filtered_users"]) {
                this.filteredUsers = this.getTransformedUserList(filteredUsersResData["filtered_users"])
              }
              this.fetchFilteredUsersSubscribtion.unsubscribe()
            }
          )
        }
        // TODO: http get request mit searchterm -> filterUser
        // wenn currentUser bereits einen Chatroom/Membership mit den jeweiligen  gesuchten/ausgewählten user hat, 
        // dann redirect hzu diesen chatroom
      }
    ) 
  }


  getTransformedUserList(users: UserResponseData[]) {
    var finalUsersList: User[] = [];

    users.forEach(
      (userResData: UserResponseData) => {
        let user = new User(
          userResData.uid.toString(), 
          userResData.email, 
          userResData.first_name, 
          userResData.surname, 
          userResData.bio
        )
        finalUsersList.push(user)
      }
    )
    return finalUsersList
  }

  
  onUserSelected(i) {
    // s. chatroom-list-component chatroomOpenedCheck() ähnlich
    this.contactSelected = true
    this.selectedUser = this.filteredUsers[i]
    
    // TODO: wenn der selektierte user bereits ein chatpartner ist  ist, dann automatisch dort hin navigieren
    // s. chatService.
    // TODO: tsa
    this.chatPartners.forEach(
      (chatPartner: User) => {
        if (chatPartner.id === this.selectedUser.id)  {
          // TODO: checken welcher chatroom einen memberlimit == 2 hat -> dann zu den room navigierten
          // TODO: close chatdialog
          this.navigateToCommonChatpartnersRoom(+this.currentUser.id, +chatPartner.id)
          return
        }
      }
      )
    }
    

    // TODO: eventuell mit subscribtion unsubscriben
    navigateToCommonChatpartnersRoom(current_uid: number, chatpartner_uid: number) {
      this.chatService.fetchCommonMembershipsOfUserAndChatPartner(current_uid, chatpartner_uid).subscribe(
        (membershipsData: MembershipResponseData[]) => {
          // console.log("common_roomid[0]", membershipsData[0].chatroom_id);
          
          this.router.navigate(["chat", membershipsData[0].chatroom_id])
          this.closeEvent.emit()
          
        }
      )
    }
    

    onCancelPrivateMessage() {
      this.contactSelected = false
  }

  onClose() {
    this.closeEvent.emit()
  }

  // 
  onSave(newChatroomEntry: ChatroomEntryModel) {
    // TODO: nicht chatroom sondern ChatroomEntryModel übergeben
    this.saveEvent.emit(newChatroomEntry)    
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
