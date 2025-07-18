import bcrypt from 'bcryptjs'
import { PasswordHasher } from '../../domain/services/password-hasher.interface'

export class PasswordHasherService implements PasswordHasher {
  async hash(plain: string) {
    return bcrypt.hash(plain, 10);
  }

  async compare(plain: string, hash: string) {
    return bcrypt.compare(plain, hash);
  }
}