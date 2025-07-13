export class UserName {
    value: string;

    constructor(value: string) {
        this.value = value;
        this.ensureIsValid();
    }

    private ensureIsValid() {
        if (!this.value) {
            throw new Error('Name is required');
        }
        if (this.value.length < 3) {
            throw new Error('Name must be at least 3 characters long');
        }
    }
}