import * as constants from '../constants'
import jwt from 'jsonwebtoken';

export const validateToken = (req, res, next) => {
    let response = { ...constants.defaultServerResponse };
    try {
        if (!req.headers.authorization) {
            throw new Error(constants.MESSAGES.token_missing);
        }
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET_KEY || constants.SECRET_KEY);
        req.body.uid = decoded.id;
        req.body.user_role = decoded.role;
        return next();
    } catch (error) {
        response.message = error.message;
        response.status = 401;
    }
    return res.status(response.status).send(response);
}

export const isDoctor = (req, res, next) => {
    let response = { ...constants.defaultServerResponse };
    if(req.body.user_role == 'DOCTOR') {
        return next();
    } else {
        response.message = constants.MESSAGES.unauthorized_role;
        response.status = 401;
    }
    return res.status(response.status).send(response);
}

export const isPatient = (req, res, next) => {
    let response = { ...constants.defaultServerResponse };
    if(req.body.user_role == 'PATIENT') {
        return next();
    } else {
        response.message = constants.MESSAGES.unauthorized_role;
        response.status = 401;
    }
    return res.status(response.status).send(response);
}
