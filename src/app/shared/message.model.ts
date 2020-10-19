export class MessageModel {
    constructor(
        public recipient_email: string,
        public current_uid: number,
        public delivery_time: Date, 
        public content: string
    ) {

    }
}