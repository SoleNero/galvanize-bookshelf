'use strict';

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const boom = require('boom');
const knex = require('../knex');

const { camelizeKeys, decamelizeKeys } = require('humps');

router.get('/books', (req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((rows) => {
      const books = camelizeKeys(rows);
      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req,res,next) => {
  knex('books')
  .where('id', req.params.id)
  .first()
  .then((rows) => {
    const books = camelizeKeys(rows);
    if(!books) {
      return next();
    }
    res.send(books);
  })
  .catch((err) => {
    next(err);
  });
});

router.post('/books', (req, res, next) => {
  const { title, author, genre, description, coverUrl } = req.body;
  if (!title || !title.trim()) {
    next(boom.create(400, 'Title must not be blank.'));
    return;
  }
  const insertBook = decamelizeKeys({ title, author, genre, description, coverUrl });
  knex('books')
  .insert(insertBook, '*')
  .then((rows) => {
    const book = camelizeKeys(rows[0]);
    res.send(book);
  })
  .catch((err) => {
    next(err);
  });
});

router.patch('/books/:id', (req, res, next) => {

  const { title, author, genre, description, coverUrl } = req.body;
     knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        return next();
      }
      const updateBook = decamelizeKeys({ title, author, genre, description, coverUrl });

      return knex('books')
        .update(updateBook, '*')
        .where('id', req.params.id);
    })
    .then((rows) => {
      const book = camelizeKeys(rows[0]);
    res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});


router.delete('/books/:id', (req, res, next) => {
    knex('books')
        .returning(['title', 'author', 'genre', 'description', 'cover_url'])
        .where('id', req.params.id)
        .del()
        .then((book) => {
            res.send(camelizeKeys(book[0]));
        })
        .catch((err) => {
          next(err);
        });
});



module.exports = router;
