'use strict';

const Joi = require('joi');

module.export.post = {
  body: {
    title: Joi.string()
      .label("Title")
      .required(),
    author: Joi.string()
      .label("Author")
      .required(),
    genre: Joi.string()
      .label("Genre")
      .required(),
    description: Joi.string()
      .label("Description")
      .required(),
    coverUrl: Joi.string()
      .label("Description")
      .required()
  }
};
