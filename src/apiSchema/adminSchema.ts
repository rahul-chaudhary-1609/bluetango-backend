import Joi from 'joi';
import * as constants from '../constants';

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

export const addNewAdmin = Joi.object({
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
  confirmPassword: Joi.string().min(8)
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
  //passkey: Joi.string().required(),
  name: Joi.string().required(),
  phone_number: Joi.string().required(),
  country_code: Joi.string().required(),
  permissions: Joi.string().optional()
});

export const forgetPassword = Joi.object({
  email: Joi.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
});

export const resetPassword = Joi.object({
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
  confirmPassword: Joi.string().min(8)
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
  otp: Joi.string().required(),
});

export const changePassword = Joi.object({
  oldPassword: Joi.string().required(),
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
  confirmPassword: Joi.string().min(8)
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

export const addEditEmployers = Joi.object ({
  id: Joi.string().optional(),
  name: Joi.string().required(),
  email: Joi.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
  // password: Joi.string().min(8).optional()
  // .max(15)
  // .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
  // // .required()
  // .messages({
  //   "string.min": constants.CUSTOM_JOI_MESSAGE.password_msg.min,
  //   "string.max": constants.CUSTOM_JOI_MESSAGE.password_msg.max,
  //   "string.base": constants.CUSTOM_JOI_MESSAGE.password_msg.base,
  //   "string.empty": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
  //   "any.required": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
  //   "string.pattern.base": constants.CUSTOM_JOI_MESSAGE.password_msg.pattern
  // }),
  country_code: Joi.string().required(),
  phone_number: Joi.string().required(),
  industry_type: Joi.string().required(),
  address: Joi.string().required(),
  contact_name: Joi.string().required(),
  // thought_of_the_day: Joi.string().optional()
})

export const addSubscriptionPlan = Joi.object ({
  plan_name: Joi.string().required(),
  description: Joi.array().required(),
  charge: Joi.string().required(),
  duration: Joi.string().required()
})

export const updateSubscriptionPlan = Joi.object ({
  id: Joi.string().required(),
  plan_name: Joi.string().allow(),
  description: Joi.array().allow(),
  charge: Joi.string().allow(),
  duration: Joi.string().allow(),
  status: Joi.number().allow()
})

export const getEmployersList = Joi.object ({
  industry_type: Joi.string().optional(),
  limit: Joi.string().optional(),
  offset: Joi.string().optional(),
  searchKey: Joi.string().optional(),
  isPagination: Joi.string().optional()
})

export const addEditCoach = Joi.object ({
  id: Joi.string().optional(),
  name: Joi.string().required(),
  email: Joi.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
  // password: Joi.string().min(8).optional()
  // .max(15)
  // .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
  // // .required()
  // .messages({
  //   "string.min": constants.CUSTOM_JOI_MESSAGE.password_msg.min,
  //   "string.max": constants.CUSTOM_JOI_MESSAGE.password_msg.max,
  //   "string.base": constants.CUSTOM_JOI_MESSAGE.password_msg.base,
  //   "string.empty": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
  //   "any.required": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
  //   "string.pattern.base": constants.CUSTOM_JOI_MESSAGE.password_msg.pattern
  // }),
  country_code: Joi.string().required(),
  phone_number: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().optional(),
  fileName: Joi.string().optional(),
  coach_specialization_category_ids:Joi.array().optional(),
  employee_rank_ids:Joi.array().optional(),
  coach_charge:Joi.number().optional(),
})

export const listFeedback = Joi.object ({
  feedbackType: Joi.number().valid(1,2,3,4).optional(),
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
  searchKey: Joi.string().optional()
})

export const getFeedbackDetails = Joi.object ({
  feedback_id: Joi.number().required(),
})

export const addEditCoachSpecializationCategories= Joi.object ({
  category_id: Joi.number().optional(),
  name: Joi.string().required(),
  description: Joi.string().required(),
})

export const listCoachSpecializationCategories= Joi.object ({
  is_pagination: Joi.number().default(1).optional(),
  searchKey: Joi.string().optional(),
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
})

export const getCoachSpecializationCategory= Joi.object ({
  category_id: Joi.number().required(),
})

export const deleteCoachSpecializationCategory= Joi.object ({
  category_id: Joi.number().required(),
})

export const addEditEmployeeRank= Joi.object ({
  rank_id: Joi.number().optional(),
  name: Joi.string().required(),
  description: Joi.string().required(),
})

export const listEmployeeRanks= Joi.object ({
  is_pagination: Joi.number().default(1).optional(),
  searchKey: Joi.string().optional(),
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
})

export const getEmployeeRank= Joi.object ({
  rank_id: Joi.number().required(),
})

export const deleteEmployeeRank= Joi.object ({
  rank_id: Joi.number().required(),
})

export const listEmployeeCoachSessions= Joi.object ({
  searchKey: Joi.string().optional(),
  date: Joi.string().optional(),
  status:Joi.number().optional(),
  employeeRankId:Joi.number().optional(),
  sessionType:Joi.number().optional(),
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
})

export const getEmployeeCoachSession= Joi.object ({
  session_id:Joi.number().required(),
})