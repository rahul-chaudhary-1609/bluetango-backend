import Joi from 'joi';
import * as constants from '../constants';
import { join } from 'path';

export const login = Joi.object({
  username: Joi.string()
  .regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i)
  .required()
  .messages(
    {
      "string.pattern.base": constants.MESSAGES.invalid_email
    }
  ),
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
  email: Joi.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required()
  .messages(
    {
      "string.pattern.base": constants.MESSAGES.invalid_email
    }
  ),
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

export const updateProfile = Joi.object({
  name: Joi.string().optional(),
  phone_number: Joi.string().min(8).max(12).optional(),
  country_code: Joi.string().max(5).optional(),
  date_of_birth: Joi.string().optional(),
  accomplishments: Joi.string().optional(),
  profile_pic_url: Joi.string().optional()
})

export const getListOfTeamMemberByManagerId = Joi.object({
  limit: Joi.string().optional(),
  offset: Joi.string().optional()
})

export const viewDetailsEmployee = Joi.object({
  id: Joi.string().required()
})

export const searchTeamMember = Joi.object({
  search_string: Joi.string().required()
})

export const editGoal = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  start_date: Joi.string().required(),
  end_date: Joi.string().required(),
  select_measure: Joi.string().required(),
  enter_measure: Joi.string().required(),
  employee_ids: Joi.string().required(),
});

// export const addGoal = Joi.object({
//   goal_details:Joi.string().required()
// });

export const addGoal = Joi.object().keys({
  goal_details: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        start_date: Joi.string().required(),
        end_date: Joi.string().required(),
        select_measure: Joi.string().required(),
        enter_measure: Joi.string().required(),
        employee_ids: Joi.array().items(Joi.number())
      })
  )
});

// export const addGoal = Joi.array().items(Joi.object().keys({
//     title: Joi.string().required(),
//     description: Joi.string().required(),
//     start_date: Joi.string().required(),
//     end_date: Joi.string().required(),
//     select_measure: Joi.string().required(),
//     enter_measure: Joi.string().required(),
//     employee_ids: Joi.string().required(),
//   })
// )