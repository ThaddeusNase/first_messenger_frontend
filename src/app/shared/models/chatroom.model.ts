import { Message } from '@angular/compiler/src/i18n/i18n_ast';

export class Chatroom {
    constructor(
        public id: number, 
        public creationDate: Date,
        public name: string,
        public member_limit: number
    ) {}

}