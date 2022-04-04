import * as constants from "../constants";
import _ from "lodash";
import { rawQuery } from "../connection";


/*
* function for select details 
* @req : token, data
*
*/
export const selectData = async (model: any, condition: any) => {
    try {
        let selectQueryServiceData;
        if (!_.isEmpty(model)) {
            if (!_.isEmpty(condition)) {
                selectQueryServiceData = await model.findOne(condition);
            } else {
                throw new Error(constants.MESSAGES.request_validation_message);
            }
        } else {
            throw new Error(constants.MESSAGES.model_name_required);
        }
        return selectQueryServiceData;
    } catch (error) {
        throw new Error(error);
    }

}

export const selectAll = async (model: any, condition: any, attributes: any) => {
    try {
        let selectQueryServiceData;
        if (!_.isEmpty(model)) {
            if (!_.isEmpty(condition)) {
                selectQueryServiceData = await model.findAll(condition);
            } else {
                selectQueryServiceData = await model.findAll();
            }
        } else {
            throw new Error(constants.MESSAGES.model_name_required);
        }
        return selectQueryServiceData;
    } catch (error) {
        throw new Error(error);
    }

}

export const selectAndCountAll = async (model: any, condition: any, attributes: any) => {
    try {
        let selectQueryServiceData;
        if (!_.isEmpty(model)) {
            if (!_.isEmpty(condition)) {
                selectQueryServiceData = await model.findAndCountAll(condition);
            } else {
                selectQueryServiceData = await model.findAndCountAll();
            }
        } else {
            throw new Error(constants.MESSAGES.model_name_required);
        }
        return selectQueryServiceData;
    } catch (error) {
        throw new Error(error);
    }

}

export const getRawQueryResult = async(query, replacements) => {
    const result = await rawQuery(query, replacements);
    return result[0]
};
