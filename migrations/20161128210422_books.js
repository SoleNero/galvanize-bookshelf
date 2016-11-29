'use strict';
exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', function(table){
    table.increments();
    table.string('title');
    table.string('author');
    table.string('gnere');
    table.text('description');
    table.text('cover_url');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
});
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('books');
};
