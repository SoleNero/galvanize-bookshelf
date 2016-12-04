'use strict';

// migrate: latest
exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', (table) => {
    table.increments();// PK defaults to id
    table.string('title').notNullable().defaultTo('');
    table.string('author').notNullable().defaultTo('');
    table.string('genre').notNullable().defaultTo('');
    table.text('description').notNullable().defaultTo('');
    table.text('cover_url').notNullable().defaultTo('');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

// migrate:rollback
exports.down = function(knex, Promise) {
  return knex.schema.dropTable('books');
};
