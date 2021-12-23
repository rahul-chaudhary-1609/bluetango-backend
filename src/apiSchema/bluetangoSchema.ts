import Joi from 'joi';
import * as constants from '../constants';

export const addBios = Joi.object({
  admin_id: Joi.number().required(),
  name: Joi.string().required(),
  description:Joi.string().required(),
  coach_id:Joi.number().required()
});
export const updateBios = Joi.object({
  id:Joi.number().required(),
  admin_id: Joi.number().required(),
  name: Joi.string(),
  description:Joi.string()
});