import * as constants from '../constants'
import jwt from 'jsonwebtoken';
import { adminModel } from '../models/index';

export const validateToken = async (req, res, next) => {
    let response = { ...constants.defaultServerResponse };
    try {
        if (!req.headers.authorization) {
            throw new Error(constants.MESSAGES.token_missing);
        }
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.ADMIN_SECRET_KEY || constants.ADMIN_SECRET_KEY);
        req.body.uid = decoded.id;
        return next();
        // let adminData = await adminModel.findOne({where: {admin_id: req.body.uid}, raw: true});
        // if(adminData && adminData.token === token)
        //     return next();
        // else
        //     throw new Error(constants.MESSAGES.session_expired);
    } catch (error) {
        response.message = error.message;
        response.status = 401;
    }
    return res.status(response.status).send(response);
}