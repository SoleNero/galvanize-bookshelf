```javascript
'use strict';
const express = require('express');
const boom = require('boom');
const knex = require('../knex');
const router = express.Router();
const { camelizeKeys, decamelizeKeys } = require('humps');
router.get('/', (_req, res, next) => {
  knex('cats')
    .orderBy('name')
    .then((rows) => {
      const cats = camelizeKeys(rows);
      res.send(cats);
    })
    .catch((err) => {
      next(err);
    });
});
router.post('/', (req, res, next) => {
  const { name, profileUrl } = req.body;
  if (!name || !name.trim()) {
    // res.status(400).send("Name must not be blank.")
    next(boom.create(400, 'Name must not be blank.'));
    return;
  }
  const insertCat = decamelizeKeys({ name, profileUrl })
  knex('cats')
    .insert((insertCat), '*')
    .then((rows) => {
      const cat = camelizeKeys(rows[0]);
      res.send(cat);
    })
    .catch((err) => {
      next(err);
    });
});
module.exports = router;

```



1.Migration & seed

- cloned it
- npm install --save pg knex
- ​