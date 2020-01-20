import { knexInstance } from '../../database/knexInstance';

const USERS_TABLE = 'users';

class UsersResource {
  async create(createUserBody) {
    const created = await knexInstance(USERS_TABLE).insert(
      createUserBody,
      '*',
    );
    return created[0];
  }

  async getUser(field, value) {
    const user = await knexInstance(USERS_TABLE)
      .where(field, value)
      .first();
    return user;
  }
}

export const usersResource = new UsersResource();

