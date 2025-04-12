const Joi = require('joi');

const createOrderSchema = Joi.object({
  order_type_id: Joi.number().required(),
  height: Joi.number().required(),
  width: Joi.number().required(),
  weight: Joi.number().required(),
  payment_id: Joi.number().required(),
  send_date: Joi.date().required(),
  post_office_id: Joi.number().required(),
  //recipient_nifs: Joi.array().items(Joi.string()).min(1).required(),
  recipient_ids: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
  description: Joi.string().allow('', null),
  delivery_type_id: Joi.number().optional(),
  delivery_date: Joi.date().optional(),
  current_status: Joi.string().optional(),
  order_status_id: Joi.number().optional()
});

module.exports = {
  createOrderSchema
};
