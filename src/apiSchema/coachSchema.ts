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