'use strict';

const Joi = require('joi');

module.export.post = {
  body: {
    email: Joi.string()
      .label('Email')
      .required()
      .email()
      .trim(),
    password: Joi.string()
      .label('Password')
      .required()
      .trim()
      .min(8)

  }
};




// 'use strict';
//
// const Joi = require('joi');
//
// module.exports.post = {
//   body: {
//     email: Joi.string(),
//     password: Joi.string()
//   }
// };
