import Joi from 'joi';
import * as constants from '../constants';
import { join } from 'path';

export const login = Joi.object({
  username: Joi.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required()
    .messages({
      "string.base": constants.CUSTOM_JOI_MESSAGE.email_msg.base,
      "string.empty": constants.CUSTOM_JOI_MESSAGE.email_msg.required,
      "any.required": constants.CUSTOM_JOI_MESSAGE.email_msg.required,
      "string.pattern.base": constants.CUSTOM_JOI_MESSAGE.email_msg.pattern
    }),
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
    .messages({
      "string.base": constants.CUSTOM_JOI_MESSAGE.email_msg.base,
      "string.empty": constants.CUSTOM_JOI_MESSAGE.email_msg.required,
      "any.required": constants.CUSTOM_JOI_MESSAGE.email_msg.required,
      "string.pattern.base": constants.CUSTOM_JOI_MESSAGE.email_msg.pattern
    }),
  user_role: Joi.string().regex(new RegExp("^(?=.*[1-5])")).required(),
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

export const addEditEmployee = Joi.object ({
  id: Joi.string().optional(),
  name: Joi.string().required(),
  email: Joi.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required(),
  password: Joi.string().min(8)
  .max(15)
  .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
  .messages({
    "string.min": constants.CUSTOM_JOI_MESSAGE.password_msg.min,
    "string.max": constants.CUSTOM_JOI_MESSAGE.password_msg.max,
    "string.base": constants.CUSTOM_JOI_MESSAGE.password_msg.base,
    "string.empty": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
    "any.required": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
    "string.pattern.base": constants.CUSTOM_JOI_MESSAGE.password_msg.pattern
  }).optional(),
  country_code: Joi.string().required(),
  phone_number: Joi.string().required(),
  current_department_id: Joi.string().required(), 
  current_designation: Joi.string().optional(),
  employee_code: Joi.string().required(),
  prev_employer: Joi.string().optional(),
  prev_department: Joi.string().optional(),
  prev_designation: Joi.string().optional(),
  prev_date_of_joining: Joi.string().optional(),
  prev_exit: Joi.string().optional(),
  current_date_of_joining: Joi.string().required(),
  manager_id: Joi.number().optional(),
  is_manager: Joi.number().valid(0, 1).required(),
  manager_team_name: Joi.string().messages({
    "string.base": constants.CUSTOM_JOI_MESSAGE.manager_team_name_msg.base,
    "string.empty": constants.CUSTOM_JOI_MESSAGE.manager_team_name_msg.required,
  }).optional(),
  manager_team_icon_url: Joi.string().messages({
    "string.base": constants.CUSTOM_JOI_MESSAGE.manager_team_icon_url_msg.base,
    "string.empty": constants.CUSTOM_JOI_MESSAGE.manager_team_icon_url_msg.required,
  }).optional(),
  
  })
  
  export const getEmployeeList = Joi.object ({
    departmentId: Joi.number().optional(),
    searchKey: Joi.string().optional(),
    limit: Joi.number().optional(),
    offset: Joi.number().optional()
  })

  export const updateEmployerDeviceToken = Joi.object({
    device_token: Joi.string().required()
  })

export const viewEmployeeDetails = Joi.object({
  employee_id: Joi.number().required()
})

export const deleteEmployee = Joi.object({
  employee_id: Joi.number().required()
})

export const editProfile = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).optional(),
  password: Joi.string().min(8).optional()
    .max(15)
    .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
    // .required()
    .messages({
      "string.min": constants.CUSTOM_JOI_MESSAGE.password_msg.min,
      "string.max": constants.CUSTOM_JOI_MESSAGE.password_msg.max,
      "string.base": constants.CUSTOM_JOI_MESSAGE.password_msg.base,
      "string.empty": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
      "any.required": constants.CUSTOM_JOI_MESSAGE.password_msg.required,
      "string.pattern.base": constants.CUSTOM_JOI_MESSAGE.password_msg.pattern
    }),
  country_code: Joi.string().optional(),
  phone_number: Joi.string().optional(),
  industry_type: Joi.number().optional(),
  address: Joi.string().optional(),
  thought_of_the_day: Joi.string().optional(),
  profile_pic_url: Joi.string().allow(null,'').optional(),
})

export const buyPlan = Joi.object({
  plan_id: Joi.number().required(),
  purchase_date: Joi.string().required(),
  expiry_date: Joi.string().required(),
  amount: Joi.number().required(),
  transaction_id: Joi.string().required(),
})

export const cancelPlan = Joi.object({
  subscription_id: Joi.number().required(),
})

export const contactUs = Joi.object({
  message: Joi.string().required(),
})

export const getManagerList = Joi.object({
  department_id: Joi.number().optional(),
})

export const updateManager = Joi.object({
  current_manager_id: Joi.number().required(),
  new_manager_id: Joi.number().required(),
})

export const addEditAttributes = Joi.object({
  attribute_id:Joi.number().optional(),
  attribute_name:Joi.string().required(),
  attribute_comment:Joi.string().optional(),
})

export const getAttributeDetails = Joi.object({
  attribute_id:Joi.number().required(),
})

export const deleteAttribute = Joi.object({
  attribute_id:Joi.number().required(),
})

export const toggleAttributeStatus = Joi.object({
  attribute_id:Joi.number().required(),
})


