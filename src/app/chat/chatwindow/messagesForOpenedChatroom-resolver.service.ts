import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { MessageModel } from "src/app/shared/models/message.model";
import { ChatService } from "../chat.service";


@Injectable({providedIn: "root"})
export class MessagesForOpenedChatroomService implements Resolve<any> {
    constructor(
        private chatService: ChatService
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<any> | Promise<any> | MessageModel[] {
        const room_id = route.params["room"] 
        return this.chatService.fetchMessagesForRoom(room_id)
    }
}