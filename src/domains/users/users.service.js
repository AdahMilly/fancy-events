import EncryptData from '../../lib/helpers/encrypt';
import createToken from '../../lib/helpers/jwtHelper';
import CustomError from '../../lib/utils/customError';
import { getConfig } from '../../config';
import { usersResource } from './users.resource';

const config = getConfig();

class UsersService {
  async create(createUserBody) {
    const { email, password, name } = createUserBody;
    const existingUser = await usersResource.getUser('email', email);
    if (existingUser) {
      throw new CustomError(401, 'User already exists');
    }
    const encryptedPassword = EncryptData.generateHash(password);
    const createdUser = await usersResource.create({
      email,
      name,
      password: encryptedPassword,
    });

    const token = createToken({ id: createdUser.id,name: createdUser.name }, config.secretKey);

    const registeredUser = {
      ...createdUser,
      token,
    };

    return registeredUser;
  }

  async login(userCredentials) {
    console.log(userCredentials)
    const user = await usersResource.getUser('email',userCredentials.email);
    if(!user){
      throw new CustomError(401, 'Wrong email or password');
    }

    console.log(user)
    const isValidPassword = await EncryptData.compareHash(userCredentials.password, user.password);
    console.log(isValidPassword);
      if(!isValidPassword){
        throw new CustomError(401, 'Wrong email or password')
     }

    const { id, name } = user;
    const token = createToken({ id, name }, config.secretKey);
    return token;
  }
}

export const usersService = new UsersService();