'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const boom = require('boom');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');




module.exports = router;
