export class UserCreatedAt {
    value: Date;

    constructor(value: Date) {
        this.value = value;
        this.ensureIsValid();
    }

    private ensureIsValid() {
        if (!this.value) {
            throw new Error('CreatedAt is required');
        }

        if (this.value > new Date()) {
            throw new Error('CreatedAt cannot be in the future');
        }
    }
}   