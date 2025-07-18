export class UserNotFoundException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UserNotFoundError';
        Object.setPrototypeOf(this, UserNotFoundException.prototype);
    }
}