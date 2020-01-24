import { knexInstance } from '../../database/knexInstance';

const EVENTS_TABLE_NAME = 'events';

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
}

export const eventResource = new EventsResource();