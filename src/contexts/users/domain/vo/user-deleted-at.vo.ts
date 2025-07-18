export class UserDeletedAt {
    private _value: Date | null;

    constructor(value: Date | null) {
        this._value = value;
        this.ensureIsValid();
    }

    get value(): Date | null {
        return this._value;
    }

    get isDeleted(): boolean {
        return this._value !== null;
    }

    private ensureIsValid() {
        if (this._value && this._value > new Date()) {
            throw new Error('DeletedAt cannot be in the future');
        }
    }

    equals(other: UserDeletedAt): boolean {
        if (this._value === null && other._value === null) {
            return true;
        }
        if (this._value === null || other._value === null) {
            return false;
        }
        return this._value.getTime() === other._value.getTime();
    }

    toString(): string {
        return this._value ? this._value.toISOString() : 'not deleted';
    }
}