import Joi from 'joi';
import * as constants from '../constants';
import { join } from 'path';

export const login = Joi.object({
  username: Joi.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
  password: Joi.string().min(8)
  .max(15)
  .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
  .required()
  .messages({
    "string.min": constants.CUSTOM_JOI_MESSAGE.password_msg.min,
    "string.max": constants.CUSTOM_JOI_MESSAGE.password_msg.max,
    "string.base": constants.CUSTOM_JOI_MESSAGE.password_msg.base,
    "string.empty": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
    "any.required": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
    "string.pattern.base": constants.CUSTOM_JOI_MESSAGE.password_msg.pattern
  })
});

export const forgotPassword = Joi.object({
  email: Joi.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
  user_role: Joi.string().regex(new RegExp("^(?=.*[1-4])")).required(),
});

export const resetPassword = Joi.object({
  password: Joi.string().min(8)
  .max(15)
  .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
  .required()
  .messages({
    "string.min": constants.CUSTOM_JOI_MESSAGE.password_msg.min,
    "string.max": constants.CUSTOM_JOI_MESSAGE.password_msg.max,
    "string.base": constants.CUSTOM_JOI_MESSAGE.password_msg.base,
    "string.empty": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
    "any.required": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
    "string.pattern.base": constants.CUSTOM_JOI_MESSAGE.password_msg.pattern
  })
});

export const addEditEmployee = Joi.object ({
    id: Joi.string().optional(),
    name: Joi.string().required(),
    email: Joi.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
    password: Joi.string().min(8)
    .max(15)
    .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
    .required()
    .messages({
      "string.min": constants.CUSTOM_JOI_MESSAGE.password_msg.min,
      "string.max": constants.CUSTOM_JOI_MESSAGE.password_msg.max,
      "string.base": constants.CUSTOM_JOI_MESSAGE.password_msg.base,
      "string.empty": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
      "any.required": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
      "string.pattern.base": constants.CUSTOM_JOI_MESSAGE.password_msg.pattern
    }),
    country_code: Joi.string().required(),
    phone_number: Joi.string().required(),
    status: Joi.string().required(),
    industry_type: Joi.string().required()
  
  })
  
  export const getEmployeeList = Joi.object ({
    industry_type: Joi.string().optional(),
    limit: Joi.string().optional(),
    offset: Joi.string().optional()
  })