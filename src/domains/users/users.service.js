import EncryptData from "../../lib/helpers/encrypt";
import createToken from "../../lib/helpers/jwtHelper";
import CustomError from "../../lib/utils/customError";
import { getConfig } from "../../config";
import { usersResource } from "./users.resource";
import { sendSms } from "../../lib/utils/smsSender";

const config = getConfig();

class UsersService {
  async create(createUserBody) {
    const { email, password, name, phoneNumber } = createUserBody;

    const existingUser = await usersResource.getUser("email", email);
    if (existingUser) {
      throw new CustomError(409, "User already exists");
    }
    const encryptedPassword = EncryptData.generateHash(password);

    let contact;
    if (phoneNumber.startsWith(0)) {
      contact = "+254" + phoneNumber.substr(1);
    } else {
      contact = phoneNumber;
    }
    const createdUser = await usersResource.create({
      email,
      name,
      password: encryptedPassword,
      phone: contact
    });

    await sendSms({ to: contact, message: `Hello ${name}, welcome to fancy events` });
    const token = createToken(
      { id: createdUser.id, name: createdUser.name },
      config.secretKey
    );

    const registeredUser = {
      ...createdUser,
      token,
    };

    return registeredUser;
  }

  async login(user) {
    const { id, name } = user;
    const token = createToken({ id }, config.secretKey);
    return { token, id, name  };
  }

  async getMyRsvps(userId) {
    const events = await usersResource.getMyRsvps(userId);
    return events;
  }
}

export const usersService = new UsersService();
