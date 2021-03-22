import { Chatroom } from "./chatroom.model";
import { MessageModel } from "./message.model";
import { User } from "./user.model";

export class ChatroomEntryModel {
    constructor(
        public room: Chatroom,
        public lastMessage: MessageModel,
        public chatpartner?: User,
    ){}
}


    // export interface UserChatroomEntry {
    //     room: RoomResponseData,
    //     lastMessage: MessageData,
    //     chatpartner: UserResponseData | null
    // }