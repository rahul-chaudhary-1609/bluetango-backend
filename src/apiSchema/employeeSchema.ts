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
  }),
  device_token: Joi.string().optional()
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

export const limitOffsetValidate = Joi.object({
  limit: Joi.string().optional(),
  offset: Joi.string().optional()
})

export const viewDetailsEmployee = Joi.object({
  id: Joi.string().required()
})

export const thoughtOfTheDay = Joi.object({
  thought_of_the_day: Joi.string().required()
})

export const updateEnergyCheck = Joi.object({
  energy_id: Joi.string().required()
})

export const feelAboutJobToday = Joi.object({
  job_emoji_id: Joi.string().required(),
  job_comments: Joi.string().optional()
})

export const getQualitativeMeasurement = Joi.object({
  employee_id: Joi.string().required()
})

export const searchTeamMember = Joi.object({
  search_string: Joi.string().required(),
  limit: Joi.string().optional(),
  offset: Joi.string().optional()
})

export const viewGoalAsManager = Joi.object({
  search_string: Joi.string().optional(),
  limit: Joi.string().optional(),
  offset: Joi.string().optional()
})

export const viewGoalDetailsAsManager = Joi.object({
  goal_id: Joi.string().required()
})

export const getChatRoomId = Joi.object({
  other_user_id: Joi.string().required()
})

export const createChatSession = Joi.object({
  chat_room_id: Joi.string().required()
})

export const getVideoChatSessionIdandToken = Joi.object({
  chat_room_id: Joi.string().required()
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

export const submitGoalAsEmployee = Joi.object({
  complete_measure: Joi.string().required(),
  description: Joi.string().required(),
  team_goal_assign_id: Joi.string().required(),
  goal_id: Joi.string().required()
});

export const goalAcceptRejectAsManager = Joi.object({
  goal_id:  Joi.string().required(),
  team_goal_assign_id:  Joi.string().required(),
  team_goal_assign_completion_by_employee_id:  Joi.string().required(),
  status:  Joi.string().regex(new RegExp("^(?=.*[1-2])")).required(),
});

export const addQualitativeMeasurement = Joi.object({
  employee_id: Joi.string().required(),
  initiative: Joi.string().required(),
  initiative_desc: Joi.string().optional(),
  ability_to_delegate: Joi.string().required(),
  ability_to_delegate_desc: Joi.string().optional(),
  clear_Communication: Joi.string().required(),
  clear_Communication_desc: Joi.string().optional(),
  self_awareness_of_strengths_and_weaknesses: Joi.string().required(),
  self_awareness_of_strengths_and_weaknesses_desc: Joi.string().optional(),
  agile_thinking: Joi.string().required(),
  agile_thinking_desc: Joi.string().optional(),
  influence: Joi.string().required(),
  influence_desc: Joi.string().optional(),
  empathy: Joi.string().required(),
  empathy_desc: Joi.string().optional(),
  leadership_courage: Joi.string().required(),
  leadership_courage_desc: Joi.string().optional(),
  customer_client_patient_satisfaction: Joi.string().required(),
  customer_client_patient_satisfaction_desc: Joi.string().optional(),
  team_contributions: Joi.string().required(),
  team_contributions_desc: Joi.string().optional(),
  time_management: Joi.string().required(),
  time_management_desc: Joi.string().optional(),
  work_product: Joi.string().required(),
  work_product_desc: Joi.string().optional()
})