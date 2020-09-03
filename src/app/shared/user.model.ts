export class User {
    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _expirationDurationDate: Date
    ) {}

    get token() {
        if (this._expirationDurationDate < new Date() || !this._expirationDurationDate) {
            return null
        } else {
            return this._token
        }

    }
}