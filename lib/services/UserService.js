
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export default class UserService {
  static async create ({ username, password, profilePhotoUrl }) {
    console.log(username, password, profilePhotoUrl);
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    // insert a user in the db with username, passwordHash
    return User.insert({ username, passwordHash, profilePhotoUrl });
  }
}
