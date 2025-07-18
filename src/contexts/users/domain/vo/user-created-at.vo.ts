export class UserCreatedAt {
    private readonly _value: Date;

    constructor(value: Date) {
        this._value = value;
        this.ensureIsValid();
    }

    get value(): Date {
        return this._value;
    }

    private ensureIsValid(): void {
        if (!this._value) {
            throw new Error('CreatedAt is required');
        }

        if (this._value > new Date()) {
            throw new Error('CreatedAt cannot be in the future');
        }
    }

    equals(other: UserCreatedAt): boolean {
        if (!other) return false;
        return this._value.getTime() === other.value.getTime();
    }

    toString(): string {
        return this._value.toISOString();
    }
}