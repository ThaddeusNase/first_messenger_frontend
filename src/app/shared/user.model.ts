export class User {
    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _expirationDate: Date
        // TODO: private session_id: string
        // TODO: "zuletzt online"-Property (oder in SessionModel)
    ) {}

    get token() {
        if (this._expirationDate < new Date() || !this._expirationDate) {
            return null
        } else {
            return this._token
        }

    }
}