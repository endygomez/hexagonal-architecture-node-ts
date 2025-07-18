export class UserUpdatedAt {
    private readonly _value: Date | null;

    constructor(value: Date | null) {
        this._value = value;
        this.ensureIsValid();
    }

    get value(): Date | null {
        return this._value;
    }

    get isUpdated(): boolean {
        return this._value !== null;
    }

    private ensureIsValid(): void {
        if (this._value && this._value > new Date()) {
            throw new Error('UpdatedAt cannot be in the future');
        }
    }

    equals(other: UserUpdatedAt): boolean {
        if (this._value === null && other._value === null) {
            return true;
        }
        if (this._value === null || other._value === null) {
            return false;
        }
        return this._value.getTime() === other._value.getTime();
    }

    toString(): string {
        return this._value ? this._value.toISOString() : 'not updated';
    }
}