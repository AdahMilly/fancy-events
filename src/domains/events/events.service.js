import { eventResource } from "./events.resource";
import CustomError from "../../lib/utils/customError";
import { usersResource } from "../users/users.resource";
import { sendSms } from "../../lib/utils/smsSender";

class EventsService {
  async create(createEventBody) {
    const createdEvent = await eventResource.create(createEventBody);
    return createdEvent;
  }
  async get() {
    const events = await eventResource.get();
    return events;
  }

  async getEvent(field, value) {
    const event = await eventResource.getEvent(field, value);
    if (!event)
      throw new CustomError(404, `No event with ${field} ${value} found`);
    return event;
  }

  async getMyEvents(userId){
    const events = await eventResource.getMyEvents(userId);
    if(!events.length){
      throw new CustomError(400, 'You have no events yet');
    }

    await Promise.all(
      events.map(async event => {
        event.guests = await this.getRsvps(event.id)
        return event;
      })
    )

    return events;
  }

  async updateEvent(updateEventBody, eventId) {
    const event = await eventResource.updateEvent(updateEventBody, eventId);
    return event;
  }

  async deleteEvent(eventId) {
    return eventResource.deleteEvent(eventId);
  }

  async rsvp(eventId, userId) {
    try {
      await eventResource.rsvp(eventId, userId);
      const event = await eventResource.getEvent("id", eventId);
      const { phone, name } = await usersResource.getUser("id", userId);
      const messageDetails = {
        to: phone,
        message: `Hello ${name}, your ticket to attend ${
          event.name
        } on ${new Date(event.date).toDateString()} at ${event.time} has been reserved successfuly. Fancy Events.`,
      };
      await sendSms(messageDetails);
    } catch (error) {
      console.log(error);
      if (error.message.includes("duplicate")) {
        throw new CustomError(
          409,
          "you already reserved a ticket for this event"
        );
      } else {
        throw new CustomError(
          500,
          "an error occured while trying to reserver a ticket, plesae try agin later"
        );
      }
    }
  }

  async getRsvps(eventId) {
    const guests = await eventResource.getRsvps(eventId);
    return guests;
  }

  async cancelRsvp(eventId, userId) {
    return eventResource.cancelRsvp(eventId, userId);
  }

  async cancelEvent(eventId) {
    const event = await eventResource.getEvent('id', eventId); 
    const guests = await eventResource.getRsvps(eventId);
    await Promise.all(guests.map(guest => sendSms({
      to: guest.phone,
      message: `Hello ${guest.name}, this is to notify you that the event, ${event.name}, has been cancelled. Fancy Events`
    })))
    return eventResource.cancelEvent(eventId);
  }
}

export const eventsService = new EventsService();
