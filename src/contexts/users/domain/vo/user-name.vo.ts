export class UserName {
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
            throw new Error('Name is required');
        }
        if (this._value.trim().length < 3) {
            throw new Error('Name must be at least 3 characters long');
        }
        if (this._value.length > 100) {
            throw new Error('Name cannot be longer than 100 characters');
        }
    }

    equals(other: UserName): boolean {
        if (!other) return false;
        return this._value === other.value;
    }

    toString(): string {
        return this._value;
    }
}