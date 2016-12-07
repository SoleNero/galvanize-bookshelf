'use strict';

const Joi = require('joi');

module.export.post = {
  body: {
    book_id: Joi.number()
      .integer()
      .label("Book ID")
      .required(),
    user_abel: Joi.number()
      .integer()
      .label("User ID")
      .required()
  }
};
