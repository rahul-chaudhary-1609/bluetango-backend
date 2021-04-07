import * as constants from '../constants'
import jwt from 'jsonwebtoken';
import { EmployersService } from '../services/admin/employersService'

//Instantiates a Home services  
const employersService = new EmployersService();

export const validateAdminToken = async (req, res, next) => {
    let response = { ...constants.defaultServerResponse };
    try {
        if (!req.headers.authorization) {
            throw new Error(constants.MESSAGES.token_missing);
        }
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.ADMIN_SECRET_KEY || constants.ADMIN_SECRET_KEY);
        let payload = {
            uid: decoded.id,
            user_role: decoded.user_role
        }
        req.user = payload;

        let isUserExist = employersService.findAdminById(req.user)
        if(isUserExist) {
            response.status = 401;
            response.message = "User has been deleted please contact admin"
            return res.status(response.status).send(response);
        }
        return next();
    } catch (error) {
        response.message = error.message;
        response.status = 401;
    }
    return res.status(response.status).send(response);
}

export const validateForgotPasswordToken = async (req, res, next) => {
    let response = { ...constants.defaultServerResponse };
    try {
        if (!req.headers.authorization) {
            throw new Error(constants.MESSAGES.token_missing);
        }
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.FORGOT_PASSWORD_SECRET_KEY || constants.FORGOT_PASSWORD_SECRET_KEY);
        let payload = {
            uid: decoded.id,
            user_role: decoded.user_role
        }
        req.user = payload;
        return next();
    } catch (error) {
        response.message = error.message;
        response.status = 401;
    }
    return res.status(response.status).send(response);
}

export const validateEmployeeToken = async (req, res, next) => {
    let response = { ...constants.defaultServerResponse };
    try {
        if (!req.headers.authorization) {
            throw new Error(constants.MESSAGES.token_missing);
        }
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.EMPLOYEE_SECRET_KEY || constants.EMPLOYEE_SECRET_KEY);
        let payload = {
            uid: decoded.id,
            user_role: decoded.user_role
        }
        req.user = payload;
        return next();
    } catch (error) {
        response.message = error.message;
        response.status = 401;
    }
    return res.status(response.status).send(response);
}

export const validateEmployerToken = async (req, res, next) => {
    let response = { ...constants.defaultServerResponse };
    try {
        if (!req.headers.authorization) {
            throw new Error(constants.MESSAGES.token_missing);
        }
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.EMPLOYER_SECRET_KEY || constants.EMPLOYER_SECRET_KEY);
        let payload = {
            uid: decoded.id,
            user_role: decoded.user_role
        }
        req.user = payload;
        return next();
    } catch (error) {
        response.message = error.message;
        response.status = 401;
    }
    return res.status(response.status).send(response);
}