import EncryptData from '../../lib/helpers/encrypt';
import createToken from '../../lib/helpers/jwtHelper';
import CustomError from '../../lib/utils/customError';
import { getConfig } from '../../config';
import { usersResource } from './users.resource';

const config = getConfig();

class UsersService {
  async create(createUserBody) {
    const { email, password, name, phoneNumber } = createUserBody;
    console.log(createUserBody);
    const existingUser = await usersResource.getUser('email', email);
    if (existingUser) {
      throw new CustomError(409, 'User already exists');
    }
    const encryptedPassword = EncryptData.generateHash(password);
    const createdUser = await usersResource.create({
      email,
      name,
      password: encryptedPassword,
      phone: phoneNumber
    });

    const token = createToken({ id: createdUser.id,name: createdUser.name }, config.secretKey);

    const registeredUser = {
      ...createdUser,
      token,
    };

    return registeredUser;
  }

  async login(user) {
    const { id } = user;
    const token = createToken({ id }, config.secretKey);
    return token;
  }

  async getMyRsvps (userId) {
    const events = await usersResource.getMyRsvps(userId);
    return events;
  }
}

export const usersService = new UsersService();