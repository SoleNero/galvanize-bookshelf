'use strict';

const Joi = require('joi');

module.export.post = {
  body: {
    title: Joi.string()
      .label("Title")
      .required(),
    author: Joi.string()
      .lebel("Author")
      .required(),
    genre: Joi.string()
      .lebel("Genre")
      .required(),
    description: Joi.string()
      .required(),
    coverUrl: Joi.string()
      .required()
  }
};
