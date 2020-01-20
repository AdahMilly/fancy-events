import { addTableTimestamps } from '../addTableTimestamps';
const USERS_TABLE_NAME = 'users';

async function createUserTable(knex) {
  await knex.schema.createTable(USERS_TABLE_NAME, (table) => {
    table.increments('id')
    .primary();

    table.string('name')
    .notNull();

    table.string('email')
    .unique()
    .notNull();

    table.string('password')
    .notNull()
  })

  await addTableTimestamps(knex, USERS_TABLE_NAME);
}

export async function up(knex){
  await createUserTable(knex);
}

export async function down(knex){
  await knex.schema.dropTable(USERS_TABLE_NAME)
}