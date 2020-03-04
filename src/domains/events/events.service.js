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
  
  async deleteEvent(eventId){
    return eventResource.deleteEvent(eventId);
  }

  async rsvp(eventId, userId){
    try {
      await eventResource.rsvp(eventId, userId);
    } catch(error){
      if(error.message.includes('duplicate')){
        throw new CustomError(409, 'you already reserved a ticket for this event')
      } else {
        throw new CustomError(500, 'an error occured while trying to reserver a ticket, plesae try agin later');
      }
    }
  
  }
 
  async getRsvps(eventId){
    const guests = await eventResource.getRsvps(eventId);
    return guests;
  }

}

export const eventsService = new EventsService();