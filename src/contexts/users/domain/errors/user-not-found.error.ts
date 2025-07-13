export class UserNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UserNotFoundError';
        Object.setPrototypeOf(this, UserNotFoundError.prototype);
    }
}