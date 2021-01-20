import jwt from 'jsonwebtoken';
import * as constants from "../constants";

export const tokenResponse = async (obj: any) => {
    const token = jwt.sign(
        { id: obj.user_id , role: obj.role}, 
        process.env.SECRET_KEY || constants.SECRET_KEY, 
        { expiresIn: '1d' }
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
        { expiresIn: '1d' }
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
        { expiresIn: '1d' }
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
