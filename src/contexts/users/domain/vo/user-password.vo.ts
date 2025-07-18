export class UserPassword {
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
            throw new Error('Password is required');
        }
        if (this._value.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(this._value)) {
            throw new Error('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(this._value)) {
            throw new Error('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(this._value)) {
            throw new Error('Password must contain at least one number');
        }
    }

    // Factory method for already hashed passwords (from database)
    static fromHashedPassword(hashedPassword: string): UserPassword {
        const instance = Object.create(UserPassword.prototype);
        instance._value = hashedPassword;
        return instance;
    }

    equals(other: UserPassword): boolean {
        if (!other) return false;
        return this._value === other.value;
    }
}