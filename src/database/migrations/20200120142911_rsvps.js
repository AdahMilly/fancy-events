import { addTableTimestamps } from '../addTableTimestamps';
const RSVPS_TABLE_NAME = 'rsvps';
const USERS_TABLE_NAME = 'users';
const EVENTS_TABLE_NAME = 'events';

async function createRsvpsTable(knex) {
  await knex.schema.createTable(RSVPS_TABLE_NAME, (table) => {
    table.integer('user_id')
    .references('id')
    .inTable(USERS_TABLE_NAME)
    .notNull();

    table.integer('event_id')
    .references('id')
    .inTable(EVENTS_TABLE_NAME)
    .notNull();

    table.boolean('attended')
      .notNullable()
      .defaultTo(false);
    
    table.boolean('cancelled')
      .notNullable()
      .defaultTo(false);

    table.unique(['user_id','event_id'])
  })

  await addTableTimestamps(knex, RSVPS_TABLE_NAME);
}

export async function up(knex){
  await createRsvpsTable(knex);
}

export async function down(knex){
  await knex.schema.dropTable(RSVPS_TABLE_NAME)
}
