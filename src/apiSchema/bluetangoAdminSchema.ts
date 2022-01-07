import Joi from 'joi';
import * as constants from '../constants';

export const login = Joi.object({
  email: Joi.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
  password: Joi.string().min(8)
  .max(15)
  // .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
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

export const addAdmin = Joi.object({
  email: Joi.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
  name: Joi.string().required(),
  phone_number: Joi.string().required(),
  country_code: Joi.string().required(),
  permissions: Joi.array().required(),
  profile_pic_url: Joi.string().allow("", null).optional(),
  social_media_handles: Joi.object().allow(null).optional(),
});

export const forgetPassword = Joi.object({
  email: Joi.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
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
export const addBios = Joi.object({
  admin_id: Joi.number().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  coach_id: Joi.number().required()
});
export const updateBios = Joi.object({
  id: Joi.number().required(),
  admin_id: Joi.number().required(),
  name: Joi.string(),
  description: Joi.string()
});

export const updateProfile = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
  profile_pic_url: Joi.string().allow("", null).optional(),
  social_media_handles: Joi.object().allow(null).optional(),
});

export const changePassword = Joi.object({
  old_password: Joi.string().min(8)
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
  new_password: Joi.string().min(8)
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
export const updateStaticContent = Joi.object({
  pricing: Joi.string(),
  contact_us: Joi.string(),
  about_us: Joi.string(),
  privacy_policy: Joi.string(),
  terms_ondition: Joi.string()
});
export const performAction = Joi.object({
  id: Joi.number().required(),
  slot_id: Joi.number().required(),
  coach_id: Joi.number().required(),
  date: Joi.string().required(),
  action: Joi.number().required().valid(1,2,3,4,5),
  start_time: Joi.string().required(),
  end_time: Joi.string().required()
});

export const addCoach = Joi.object ({
  name: Joi.string().required(),
  email: Joi.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
  country_code: Joi.string().required(),
  phone_number: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().optional(),
  fileName: Joi.string().optional(),
  coach_specialization_category_ids:Joi.array().optional(),
  employee_rank_ids:Joi.array().optional(),
  coach_charge:Joi.number().optional(),
})

export const editCoach = Joi.object ({
  coach_id: Joi.number().required(),
  name: Joi.string().required(),
  email: Joi.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
  country_code: Joi.string().required(),
  phone_number: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().optional(),
  fileName: Joi.string().optional(),
  coach_specialization_category_ids:Joi.array().optional(),
  employee_rank_ids:Joi.array().optional(),
  coach_charge:Joi.number().optional(),
})

export const getCoachList=Joi.object({
  searchKey:Joi.string().optional(),
  coach_specialization_category_id:Joi.number().optional(),
  employee_rank_id:Joi.number().optional(),
  status:Joi.number().optional().valid(0,1),
  rating:Joi.number().optional().valid(1,2,3,4,5),
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
})

export const getCoachDetails=Joi.object({
  coach_id: Joi.number().required(),
})

export const deleteCoach=Joi.object({
  coach_id: Joi.number().required(),
})

export const blockUnblockCoach=Joi.object({
  coach_id: Joi.number().required(),
  status:Joi.number().required().valid(0,1),
})

export const listCoachSpecializationCategories= Joi.object ({
  is_pagination: Joi.number().default(1).optional(),
  searchKey: Joi.string().optional(),
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
})

export const listEmployeeRanks= Joi.object ({
  is_pagination: Joi.number().default(1).optional(),
  searchKey: Joi.string().optional(),
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
})