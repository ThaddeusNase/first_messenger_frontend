export class MembershipModel {
    constructor(
        public id: number,
        public join_date: Date,
        public user_id: number,
        public chatroom_id: number
    ) {}
}