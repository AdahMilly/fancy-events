import { addTableTimestamps } from '../addTableTimestamps';
const EVENTS_TABLE_NAME = 'events';
const USERS_TABLE_NAME = 'users';

async function createEventTable(knex) {
  await knex.schema.createTable(EVENTS_TABLE_NAME, (table) => {
    table.increments('id')
    .primary();

    table.string('name')
    .notNull();

    table.string('category')
    .notNull();

    table.string('description')
    .notNull()

    table.string('location')
    .notNull();

    table.date('date')
    .notNull();

    table.time('time')
    .notNull();

    table.integer('created by')
    .references('id')
    .inTable(USERS_TABLE_NAME)
    .notNull();
  })

  await addTableTimestamps(knex, EVENTS_TABLE_NAME);
}

export async function up(knex){
  await createEventTable(knex);
}

export async function down(knex){
  await knex.schema.dropTable(EVENTS_TABLE_NAME)
}
