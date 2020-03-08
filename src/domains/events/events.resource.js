import { knexInstance } from '../../database/knexInstance';
import { usersResource } from '../users/users.resource';

const EVENTS_TABLE_NAME = 'events';
const RSVPS_TABLE = 'rsvps';
const USERS_TABLE = 'users';

class EventsResource{
  async create(eventBody){
    const created = await knexInstance(EVENTS_TABLE_NAME).insert(eventBody, '*');
    return created[0];
  }
  async get(){
    const events = await knexInstance(EVENTS_TABLE_NAME).select('*')
    return events;
  }

  async getEvent(feild, value){
  const event = await knexInstance(EVENTS_TABLE_NAME)
    .select('*')
    .where(feild, value)
    .first()

    return event;
  }

  async updateEvent(updateEventBody, eventId){
    const updatedEvent = await knexInstance(EVENTS_TABLE_NAME)
    .update(updateEventBody, '*')
    .where('id',eventId)

    return updatedEvent;
  }

  async deleteEvent(eventId){
    return knexInstance(EVENTS_TABLE_NAME)
      .delete()
      .where('id', eventId)
  }

  async rsvp(eventId, userId){
    return knexInstance(RSVPS_TABLE)
      .insert({eventId, userId});
  }

  async getRsvps(eventId){
    const guests = await knexInstance(RSVPS_TABLE)
    .select(['name', 'email'])
    .innerJoin(USERS_TABLE, `${USERS_TABLE}.id`, `${RSVPS_TABLE}.user_id`)
    .where(`${RSVPS_TABLE}.event_id`, eventId);
    return guests; 
  }

}

export const eventResource = new EventsResource();