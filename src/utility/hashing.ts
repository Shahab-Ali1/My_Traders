import * as bcrypt from 'bcrypt';


// export const Hashing = {
//   make: async (value: string) => await bcrypt.hash(value, process.env.HASH_KEY as string),
//   check: async (value: string, hash: string) => await bcrypt.compare(value, hash),
//   generateKey: async () => await bcrypt.genSalt(),
// };

export class PasswordUtil {
  private static readonly SALT_ROUNDS = 10;

  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async compare(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
