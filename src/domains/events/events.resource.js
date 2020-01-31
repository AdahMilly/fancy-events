import { knexInstance } from '../../database/knexInstance';

const EVENTS_TABLE_NAME = 'events';
const RSVPS_TABLE = 'rsvps';

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

  async getRsvps(field, value ){
    const rsvps = await knexInstance(RSVPS_TABLE)
      .select('*')
      .where(field, value);
    return rsvps;
  }
}

export const eventResource = new EventsResource();