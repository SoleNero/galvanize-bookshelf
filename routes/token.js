'use strict';
const express = require('express');
const router = express.Router();

const boom = require('boom');
const humps = require('humps');
const knex = require('../knex');
const bcrypt = require('bcrypt-as-promised');
const jwt = require('jsonwebtoken');


router.get('/token', (req, res, next) => {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err) => {
      if (err) {
        return res.send(false);
      }
      res.send(true);
    });
  });

  router.post('/token', (req, res, next) => {
    const { email, password } = req.body;
    knex('users')
      .where('email', email)
      .first()
      .then((user) => {
        if (!user) {
          return next(boom.create(400, 'Bad email or password'));
        }

        const hash = user.hashed_password;
        bcrypt.compare(password, hash)
          .then((same) => {
            if (same) {

              let token = jwt.sign({
                id: user.id,
                email: user.email },
              process.env.JWT_SECRET);
              res.cookie('token', token, {
                httpOnly: true});

              return res.send(humps.camelizeKeys({
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name
              }));
            }
            else {
              next(boom.create(400, 'Bad email or password'));
            }
          })
          .catch((err) => {
            next(boom.create(400, 'Bad email or password'));
          });
      })
      .catch((err) => {
        res.send(err);
      });
  });

router.delete('/token', (req, res, next) => {
  res.clearCookie('token');
  res.send(true);
});



module.exports = router;
