import { knexInstance } from '../../database/knexInstance';

const USERS_TABLE = 'users';
const RSVPS_TABLE = 'rsvps';
const EVENTS_TABLE = 'events';

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

  async getMyRsvps(userId) {
    const events = await knexInstance(RSVPS_TABLE)
    .select('*')
    .innerJoin(EVENTS_TABLE, `${EVENTS_TABLE}.id`, `${RSVPS_TABLE}.event_id`)
    .where(`${RSVPS_TABLE}.user_id`, userId);
    return events;
  }
  // first fetch the rsvps using the userId // select *  from rsvps where userId = 2;
  // sample rsvp { userId: 2, eventId: 3}
  // select * from events where id = 3
  // select * from rsvps  join events on events.id = rspvs.event_id where rsvps.user_id = 2
}

export const usersResource = new UsersResource();

