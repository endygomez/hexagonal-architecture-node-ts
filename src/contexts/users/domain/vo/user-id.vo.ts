export class UserId {
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
            throw new Error('Id is required');
        }
        if (this._value.trim().length === 0) {
            throw new Error('Id cannot be empty');
        }
    }

    equals(other: UserId): boolean {
        if (!other) return false;
        return this._value === other.value;
    }

    toString(): string {
        return this._value;
    }
}