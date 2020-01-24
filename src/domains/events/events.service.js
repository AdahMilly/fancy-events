import { eventResource } from './events.resource';
import CustomError from '../../lib/utils/customError';

class EventsService {
  async create(createEventBody){
    const createdEvent = await eventResource.create(createEventBody);
    return createdEvent;
  }
  async get(){
    const events = await eventResource.get();
    return events;
  }

  async getEvent(field, value){
    const event = await eventResource.getEvent(field, value);
    if(!event) throw new CustomError(404, `No event with ${field} ${value} found`)
    return event;
  }

  async updateEvent(updateEventBody, eventId){
    const event = await eventResource.updateEvent(updateEventBody, eventId);
    return event;
  }

}

export const eventsService = new EventsService();