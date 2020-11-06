export class MessageModel {
    constructor(
        public id: number,
        public content: string,
        public creationDate: Date,
        public chatroomId: number,
        public authorUid: number, 
        
        // public delivery_time: Date,
    ) {

    }
}