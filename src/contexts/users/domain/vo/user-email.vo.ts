export class UserEmail {
    
    value: string;

    constructor(value: string) {
        this.value = value;
        this.ensureIsValid();
    }

    private ensureIsValid() {
        if (!this.value) {
            throw new Error('Email is required');
        }
        if (!this.value.includes('@')) {
            throw new Error('Invalid email');
        }
    }
}