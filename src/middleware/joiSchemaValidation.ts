import Joi from 'joi';
import * as constants from '../constants';
import { errorResponse } from '../utils/appUtils'

/* function for validating the schema */
const validateObjectSchema = (data, schema) => {
  const result = schema.validate(data);
  if (result.error) {
    const errorDetails = result.error.details.map(value => {
      return {
        message: value.message,
        path: value.path
      };
    });
    return errorDetails;
  }
  return null;
}

/* function for validating the request body */
export const validateBody = (schema) => {
  return (req, res, next) => {
    const error = validateObjectSchema(req.body, schema);
    if (error) {
      return errorResponse(res, error, constants.code.error_code, error[0].message.split('"').join(""))
    }
    return next();
  }
}

/* function for validating the request params */
export const validateQueryParams = (schema) => {
  return (req, res, next) => {
    const error = validateObjectSchema(req.query, schema);
    if (error) {
      return errorResponse(res, error, constants.code.error_code, error[0].message.split('"').join(""))
    }
    return next();
  }
}
