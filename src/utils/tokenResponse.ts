import jwt from 'jsonwebtoken';
import * as constants from "../constants";

export const tokenResponse = async (obj: any) => {
    const token = jwt.sign(
        { id: obj.user_id , role: obj.role}, 
        process.env.SECRET_KEY || constants.SECRET_KEY, 
        //{ expiresIn: '1d' }
    );
    return { token };
}

export const adminTokenResponse = async (obj: any) => {
    const token = jwt.sign(
        { 
            id: obj.id,
            user_role: obj.admin_role
        }, 
        process.env.ADMIN_SECRET_KEY || constants.ADMIN_SECRET_KEY, 
        //{ expiresIn: '1d' }
    );
    return { token };
}

export const employeeTokenResponse = async (obj: any) => {
    const token = jwt.sign(
        { 
            id: obj.id,
            user_role: constants.USER_ROLE.employee
        }, 
        process.env.EMPLOYEE_SECRET_KEY || constants.EMPLOYEE_SECRET_KEY, 
        //{ expiresIn: '1d' }
    );
    return { token };
}

export const employerTokenResponse = async (obj: any) => {
    const token = jwt.sign(
        { 
            id: obj.id,
            user_role: constants.USER_ROLE.employer
        }, 
        process.env.EMPLOYER_SECRET_KEY || constants.EMPLOYER_SECRET_KEY, 
        //{ expiresIn: '1d' }
    );
    return { token };
}

export const coachTokenResponse = async (obj: any) => {
    const token = jwt.sign(
        {
            id: obj.id,
            user_role: constants.USER_ROLE.coach
        },
        process.env.COACH_SECRET_KEY || constants.COACH_SECRET_KEY,
        //{ expiresIn: '1d' }
    );
    return { token };
}

export const forgotPasswordTokenResponse = async (obj: any, role:any) => {
    const token = jwt.sign(
        { 
            id: obj.id,
            user_role: role
        }, 
        process.env.FORGOT_PASSWORD_SECRET_KEY || constants.FORGOT_PASSWORD_SECRET_KEY, 
        { expiresIn: process.env.FORGOT_PASSWORD_LINK_EXPIRE_IN_MINUTES }
    );
    return { token };
}

export const verificationEmailToken = async (obj: any) => {
    const token = jwt.sign(
        { id: obj.id }, 
        process.env.EMAIL_SECRET_KEY || constants.EMAIL_SECRET_KEY, 
        { expiresIn: '1d' }
    );
    return { token };
}

export const validateEmailToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.EMAIL_SECRET_KEY || constants.EMAIL_SECRET_KEY);
        return decoded.id
    } catch (error) {
        throw new Error(constants.MESSAGES.invalid_email_token)
    }
}
