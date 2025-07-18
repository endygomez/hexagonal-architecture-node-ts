export class UserId {
    public readonly value: string;

    constructor(value: string) {
        this.value = value;
        this.ensureIsValid();
    }

    private ensureIsValid() {
        if (!this.value) {
            throw new Error('Id is required');
        }
    }
}