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
  // .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
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
  profile_pic_url: Joi.string().optional(),
  prev_employers:Joi.array().items(Joi.object().keys({
      prev_employer: Joi.string().required(),
      prev_department: Joi.string().required(),
      prev_designation: Joi.string().required(),
      prev_date_of_joining: Joi.string().required(),
      prev_exit: Joi.string().required(),
  })).optional(),
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
  employee_id: Joi.string()
})

export const getQualitativeMeasurementDetails = Joi.object({
  name: Joi.string()
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
  goal_id: Joi.number().required()
})

export const viewGoalDetailsAsEmployee = Joi.object({
  goal_id: Joi.string().required()
})

export const getChatRoomId = Joi.object({
  other_user_id: Joi.string().required(),
  type: Joi.number(),
})

export const createChatSession = Joi.object({
  chat_room_id: Joi.string().required()
})

export const dropChatSession = Joi.object({
  chat_room_id: Joi.string().required()
})

export const checkChatSession = Joi.object({
  chat_room_id: Joi.string().required()
})

export const getChatSessionIdandToken = Joi.object({
  chat_room_id: Joi.string().required()
})

export const sendChatNotification = Joi.object({
  chat_room_id: Joi.string().required(),
  chat_type: Joi.string().trim().valid('text', 'audio', 'video').required(),
  message: Joi.string(),
  session_id: Joi.string(),
  token: Joi.string(),
})

export const sendChatDisconnectNotification = Joi.object({
  chat_room_id: Joi.string().required(),
  chat_type: Joi.string().trim().valid('audio', 'video').required(),
  disconnect_type: Joi.number(),
  session_id: Joi.string(),
  token: Joi.string(),
})

export const contactUs = Joi.object({
  message: Joi.string().required(),
})

export const getAchievements = Joi.object({
  is_pagination:Joi.number().optional(),
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
})

export const getAchievementById = Joi.object({
  achievement_id: Joi.number().required(),
})


export const createUpdateAchievement = Joi.object({
  achievement_id: Joi.number(),
  description: Joi.string().required(),
})

export const likeDislikeAchievement = Joi.object({
  achievement_id: Joi.number().required(),
})

export const highFiveAchievement = Joi.object({
  achievement_id: Joi.number().required(),
})

export const addEditCommentAchievement = Joi.object({
  achievement_id: Joi.number().required(),
  achievement_comment_id: Joi.number(),
  comment: Joi.string().required(),
})

export const getAchievementComments = Joi.object({
  achievement_id: Joi.number().required(),
})

export const deleteAchievement = Joi.object({
  achievement_id: Joi.number().required(),
})

export const deleteAchievementComment = Joi.object({
  achievement_comment_id: Joi.number().required(),
})

export const markNotificationsAsViewed = Joi.object({
  type: Joi.string().optional(),
  chat_room_id: Joi.number().optional(),
})

// export const getUnseenNotificationCount = Joi.object({
//   type: Joi.string().optional(),
// })

export const getAchievementLikesList = Joi.object({
  achievement_id: Joi.number().required(),
})

export const getAchievementHighFivesList = Joi.object({
  achievement_id: Joi.number().required(),
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
  description: Joi.string().optional(),
  team_goal_assign_id: Joi.string().required(),
  goal_id: Joi.string().required()
});

export const goalAcceptRejectAsManager = Joi.object({
  goal_id:  Joi.string().required(),
  team_goal_assign_id:  Joi.string().required(),
  team_goal_assign_completion_by_employee_id: Joi.string().required(),
  manager_comment: Joi.string().optional(),
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
  self_awareness_of_strengths_and_weaknesses: Joi.string().optional(),
  self_awareness_of_strengths_and_weaknesses_desc: Joi.string().optional(),
  agile_thinking: Joi.string().required(),
  agile_thinking_desc: Joi.string().optional(),
  influence: Joi.string().optional(),
  influence_desc: Joi.string().optional(),
  empathy: Joi.string().required(),
  empathy_desc: Joi.string().optional(),
  leadership_courage: Joi.string().optional(),
  leadership_courage_desc: Joi.string().optional(),
  customer_client_patient_satisfaction: Joi.string().optional(),
  customer_client_patient_satisfaction_desc: Joi.string().optional(),
  team_contributions: Joi.string().optional(),
  team_contributions_desc: Joi.string().optional(),
  time_management: Joi.string().optional(),
  time_management_desc: Joi.string().optional(),
  work_product: Joi.string().optional(),
  work_product_desc: Joi.string().optional()
})

export const addAttributeRatings=Joi.object({
  employee_id: Joi.number().required(),
  ratings:Joi.array().items(Joi.object().keys({
              attribute_id:Joi.number().required(),
              name: Joi.string().required(),
              rating: Joi.number().valid(1,2,3,4,5).required(),
              desc:Joi.string().optional(),
          })).required(),
});

export const getAttributeRatings = Joi.object({
  employee_id:Joi.number().optional(),
})

export const getAttributes = Joi.object({
  attribute_id:Joi.number().optional(),
})

export const viewGoalAssignCompletionAsManager = Joi.object({
  goal_id: Joi.number().required(),
  team_goal_assign_id: Joi.number().required(),
});

export const getQuantitativeStatsOfGoalsAsManager= Joi.object({
  employee_id: Joi.number().required(),
});

export const referFriend = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().max(10).min(10).optional(),
});

export const feedback = Joi.object({
  rating: Joi.number().required(),
  message: Joi.string().optional(),
});

export const getGoalCompletionAverageAsManager=Joi.object({
  goal_id: Joi.number().optional(),
});

export const shareEmployeeCV=Joi.object({
  to_email: Joi.string().required(),
  subject: Joi.string().optional(),
  message: Joi.string().optional(),
});

export const toggleGoalAsPrimary=Joi.object({
  team_goal_assign_id: Joi.number().required(),
});

export const markGoalsAsPrimary=Joi.object({
  goals:Joi.array().items(Joi.object().keys({
            team_goal_assign_id: Joi.number().required(),
            is_primary: Joi.number().valid(0,1).required(),
        })).required(),
});

export const clearChat = Joi.object({
  chat_room_id: Joi.number().required()
})

export const getCoachList= Joi.object({
  searchKey: Joi.string().allow(null,"").optional(),
  coach_specialization_category_id:Joi.number().optional(),
  sortBy: Joi.number().optional(),
  filterBy: Joi.number().optional(),
  date: Joi.string().required(),
  is_pagination:Joi.number().optional(),
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
})

export const getSlots= Joi.object({
  coach_id: Joi.number().required(),
  filter_key: Joi.string().valid("Daily","Weekly","Monthly", "Yearly").allow(null, '').optional(),
  date: Joi.string().allow(null, '').optional(),
  day: Joi.string().allow(null, '').optional(),
  week: Joi.string().allow(null, '').optional(),
  month: Joi.string().allow(null, '').optional(),
  year: Joi.string().allow(null, '').optional(),
})

export const getSlot= Joi.object({
  slot_id: Joi.number().required(),
})

export const createSessionRequest= Joi.object({
  slot_id:Joi.number().required(),
  query:Joi.string().required(),
  coach_id:Joi.number().required(),
  coach_specialization_category_id:Joi.number().required(),
  date:Joi.string().required(),
  start_time:Joi.string().required(),
  end_time:Joi.string().allow(null,'').optional(),    
})


export const getSessions=Joi.object({
  datetime:Joi.string().optional(),
  is_pagination:Joi.number().optional(),
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
})

export const cancelSession=Joi.object({
  session_id:Joi.number().required(),
  cancel_reason: Joi.string().required(),
  datetime:Joi.string().optional(),
})

export const listSessionHistory=Joi.object({
  datetime:Joi.string().optional(),
  is_pagination:Joi.number().optional(),
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
})

export const getSessionHistoryDetails=Joi.object({
  session_id:Joi.number().required(),
})

export const rateCoachSession=Joi.object({
  session_id:Joi.number().required(),
  rating:Joi.number().required(),
  comment:Joi.string().optional(),
})

export const skipRateSession=Joi.object({
  session_id:Joi.number().required(),
})

export const getNotRatedSessions=Joi.object({
  datetime:Joi.string().required(),
})
