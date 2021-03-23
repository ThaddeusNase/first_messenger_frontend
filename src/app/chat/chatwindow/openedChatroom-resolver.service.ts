import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { Chatroom } from 'src/app/shared/models/chatroom.model';
import { MembershipModel } from 'src/app/shared/models/membership.model';
import { CurrentUser } from 'src/app/shared/models/currentuser.model';
import { UserResponseData, UsersService } from 'src/app/shared/services/users.service';
import { ChatService, ChatWindowHeaderInfoResponseData, MembershipResponseData, MembershipsResponseData, RoomResponseData } from '../chat.service';

@Injectable({providedIn: "root"})
export class OpenedChatroomResolverService implements Resolve<any> {

    constructor (
        private chatService: ChatService,
        private usersService: UsersService
    ) {}

    currentUserData: {
        email: string,
        id: number,
        _token: string,
        _expirationDate: string
      } = JSON.parse(localStorage.getItem("userData"))

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<any> | ChatWindowHeaderInfoResponseData  {
        const currentUserData: {
            email: string,
            id: number,
            _token: string,
            _expirationDate: string
          } = JSON.parse(localStorage.getItem("userData"))
        
        const room_id = route.params["room"];
        return this.chatService.fetchChatWindowHeaderInformation(currentUserData.id, room_id)






        // ------------------------- ALTER APPROACH --------------------------------

        // var opernedChatroom: Chatroom;
        // var membershipsForOpenedRoom: MembershipModel[]
        
        // const room_id = route.params["room"];

        // return this.chatService.getAllMembershipsForRoomId(room_id).pipe(
        //     take(1),
        //     exhaustMap(
        //         (membershipsResData: MembershipsResponseData) => {
        //             var memberships: MembershipModel[] = membershipsResData.memberships
        //             if (memberships.length === 2) {
        //                 var chatPartnerId: number;
        //                 memberships.forEach((membership:MembershipModel) => {
        //                     console.log("---membership: ", membership  );
        //                     if (membership.user_id !== this.currentUserData.id) {
        //                         chatPartnerId = membership.user_id
        //                         return
        //                     } 
        //                 })
        //                 return this.usersService.fetchUserByUid(chatPartnerId.toString())  
        //             } else {
        //                 return this.chatService.getChatroomById(room_id)
        //             }

        //         }
        //     )
        // )

        
    }

}