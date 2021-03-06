import { knexInstance } from "../../database/knexInstance";

const EVENTS_TABLE_NAME = "events";
const RSVPS_TABLE = "rsvps";
const USERS_TABLE = "users";

class EventsResource {
  async create(eventBody) {
    const created = await knexInstance(EVENTS_TABLE_NAME).insert(
      eventBody,
      "*"
    );
    return created[0];
  }
  async get() {
    const events = await knexInstance
      .select("event.*", 'rsvp.event_id', knexInstance.raw('ARRAY_AGG(rsvp.user_id) as guests'))
      .from({ event: EVENTS_TABLE_NAME })
      .leftJoin({ rsvp: RSVPS_TABLE }, 'rsvp.event_id', 'event.id' )
      .where('event.cancelled', false)
      .groupBy('event.id', 'rsvp.event_id')
    return events;
  }

  async getEvent(feild, value) {
    const event = await knexInstance(EVENTS_TABLE_NAME)
      .select("*")
      .where(feild, value)
      .first();

    return event;
  }

  async getMyEvents(userId) {
    const events = await knexInstance(EVENTS_TABLE_NAME)
      .select("*")
      .where("created_by", userId);
    return events;
  }

  async updateEvent(updateEventBody, eventId) {
    const updatedEvent = await knexInstance(EVENTS_TABLE_NAME)
      .update(updateEventBody, "*")
      .where("id", eventId);

    return updatedEvent;
  }

  async deleteEvent(eventId) {
    await knexInstance(RSVPS_TABLE).delete().where('event_id', eventId)
    return knexInstance(EVENTS_TABLE_NAME).delete().where("id", eventId);
  }

  async rsvp(eventId, userId) {
    return knexInstance(RSVPS_TABLE).insert({ eventId, userId });
  }

  async getRsvps(eventId) {
    const guests = await knexInstance(RSVPS_TABLE)
      .select(["name", "phone", "id"])
      .innerJoin(USERS_TABLE, `${USERS_TABLE}.id`, `${RSVPS_TABLE}.user_id`)
      .where(`${RSVPS_TABLE}.event_id`, eventId)
      .where(`${RSVPS_TABLE}.cancelled`, false);
    return guests;
  }

  async cancelRsvp(eventId, userId) {
    return knexInstance(RSVPS_TABLE)
      .delete()
      .where({ eventId, userId });
  }

  async cancelEvent(eventId) {
    return knexInstance(EVENTS_TABLE_NAME)
      .update({ cancelled: true })
      .where("id", eventId);
  }
}

export const eventResource = new EventsResource();
