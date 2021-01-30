export class SessionModel {
    constructor(
        private _sid: string, 
        public expirationDate: Date,
        public uid: number
    ) {}

    get sid() {
        if (this.expirationDate < new Date() || this.expirationDate) {
            return null
        } else {
            return this._sid
        }
    }
}