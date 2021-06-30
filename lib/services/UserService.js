
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export default class UserService {
  static async create ({ username, password, profilePhotoUrl }) {

    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    // insert a user in the db with username, passwordHash
    return User.insert({ username, passwordHash, profilePhotoUrl });
  }

  static async authorize({ username, password }) {
    // check that the user exists
    const user = await User.findByUsername(username);
    if(!user) {
      throw new Error('Invalid username/password');
    }

    // check that the users password matches the password hash
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if(!passwordMatch) {
      throw new Error('Invalid username/password');
    }

    return user;
  }
}
