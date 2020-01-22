import { knexInstance } from '../../database/knexInstance';

const EVENTS_TABLE_NAME = 'events';

class EventsResource{
  async create(eventBody){
    const created = await knexInstance(EVENTS_TABLE_NAME).insert(eventBody, '*');
    return created[0];
  }
}

export const eventResource = new EventsResource();