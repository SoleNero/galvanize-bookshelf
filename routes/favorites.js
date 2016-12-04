'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const humps = require('humps');
const knex = require('../knex');
const boom = require('boom');
const jwt = require('jsonwebtoken');

router.get('/favorites', (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }
    knex('favorites')
    .join('books', 'favorites.book_id', '=', 'books.id')
    .where('user_id', decoded.id)
      .then((books) => {
        res.set('content-type', 'application/json');
        res.send(humps.camelizeKeys(books));
      })
      .catch((err) => {
        res.send(err);
      });
  });
});

router.get('/favorites/check', (req, res, next) => {
  const bookId = req.query.bookId;
  if (isNaN(bookId)) {
    return next(boom.create(400, 'Book ID must be an integer'));
  }

  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }

    knex('favorites')
    .join('books', 'favorites.book_id', '=', 'books.id')
    .where('favorites.user_id', decoded.id)
    .andWhere('books.id', bookId)
      .then((book) => {
        if (book.length) {
          return res.send(true);
        }
        res.send(false);
      })
      .catch((err) => {
        res.send(err);
      });
  });
});

router.post('/favorites', (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }
    const bookId = req.body.bookId;

    if (isNaN(bookId)) {
      return next(boom.create(400, 'Book ID must be an integer'));
    }

    knex('books')
      .where('books.id', bookId)
      .then((book) => {
        if (book.length === 0) {
          return next(boom.create(404 , 'Book not found'));
        }
        knex('favorites')
          .insert({
            book_id: bookId,
            user_id: decoded.id
          }, ['id', 'book_id', 'user_id'])
          .then((favorite) => {
            res.set('content-type', 'application/json');
            res.send(humps.camelizeKeys(favorite[0]));
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  });
});

router.delete('/favorites', (req, res, next) => {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }
    const bookId = req.body.bookId;

    if (isNaN(bookId)) {
      return next(boom.create(400, 'Book ID must be an integer'));
    }

    knex('books')
      .where('books.id', bookId)
      .then((book) => {
        if (book.length === 0) {
          return next(boom.create(404, 'Favorite not found'));
        }
        if (typeof(bookId) !== 'undefined') {
          knex('favorites')
            .del(['book_id', 'user_id'])
            .where('favorites.book_id', bookId)
            .andWhere('favorites.user_id', decoded.id)
            .then((favorite) => {
              res.set('content-type', 'application/json');
              return res.send(humps.camelizeKeys(favorite[0]));
            })
            .catch((err) => {
              next(err);
            });
        }
        else {
          return next(boom.create(404, 'No book'));
        }
      })
      .catch((err) => {
        next(err);
      });

  });
});


module.exports = router;
