import Joi from 'joi';
import * as constants from '../constants';

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
    device_token: Joi.string().optional(),
    app_id: Joi.number().optional().valid(1,2)
});

export const forgotPassword = Joi.object({
    email: Joi.string().regex(/^(?:^[0-9]{4,15}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i).required()
        .messages(
            {
                "string.pattern.base": constants.MESSAGES.invalid_email
            }
        ),
    user_role: Joi.string().regex(new RegExp("^(?=.*[1-5])")).required(),
    app_id: Joi.number().optional().valid(1,2)
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
    description: Joi.string().optional(),
    image: Joi.string().optional(),
    fileName: Joi.string().optional()
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

export const markNotificationsAsViewed = Joi.object({
    type: Joi.string().optional(),
    chat_room_id: Joi.number().optional(),
})


export const updateEmployerDeviceToken = Joi.object({
    device_token: Joi.string().required()
})

export const clearChat = Joi.object({
    chat_room_id: Joi.number().required()
})

export const addSlot= Joi.object({
    date: Joi.string().required(),
    // start_time: Joi.string().required(),
    // end_time: Joi.string().required(),
    slots:Joi.array().items(Joi.object().keys({
        start_time: Joi.string().required(),
        end_time: Joi.string().required(),
    })).required(),
    type: Joi.number().required(),
    day: Joi.number().optional(),
    custom_date:Joi.string().optional(),
    custom_dates:Joi.array().optional(),
})

export const getSlots= Joi.object({
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

export const deleteSlot= Joi.object({
    type:Joi.number().required(),
    group_type:Joi.number().optional(),
    slot_id: Joi.number().optional(),
    slot_date_group_id: Joi.string().optional(),
    slot_time_group_id: Joi.string().optional(),
    current_date: Joi.string().optional(),
})

export const getSessionRequests=Joi.object({
    datetime:Joi.string().optional(),
    is_pagination:Joi.number().optional(),
    limit: Joi.number().optional(),
    offset: Joi.number().optional(),
})

export const acceptSessionRequest=Joi.object({
    session_id:Joi.number().required(),
    timezone:Joi.string().required(),
})

export const rejectSessionRequest=Joi.object({
    session_id:Joi.number().required(),
})

export const getAcceptedSessions=Joi.object({
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

export const updateZoomMeetingDuration=Joi.object({
    session_id:Joi.number().required(),
})

export const endZoomMeeting=Joi.object({
    session_id:Joi.number().required(),
})