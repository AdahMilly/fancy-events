import { eventResource } from './events.resource';

class EventsService {
  async create(createEventBody){
    const createdEvent = await eventResource.create(createEventBody);
    return createdEvent;
  }
}

export const eventsService = new EventsService();