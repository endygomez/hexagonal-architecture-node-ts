export class UserEmail {
    private readonly _value: string;

    constructor(value: string) {
        this._value = value;
        this.ensureIsValid();
    }

    get value(): string {
        return this._value;
    }

    private ensureIsValid(): void {
        if (!this._value) {
            throw new Error('Email is required');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this._value)) {
            throw new Error('Invalid email format');
        }
    }

    equals(other: UserEmail): boolean {
        if (!other) return false;
        return this._value.toLowerCase() === other.value.toLowerCase();
    }

    toString(): string {
        return this._value;
    }
}