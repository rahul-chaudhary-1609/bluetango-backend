import * as constants from "../constants";
import _ from "lodash";


/*
* function for delete details 
* @req : token, data
*
*/
export const deleteData = async (params: any, condition: any) => {
    let deleteQueryServiceData;
    if (!_.isEmpty(params.model)) {
        if (!_.isEmpty(params) && !_.isEmpty(condition)) {
            let model = params.model;
            deleteQueryServiceData = await model.destroy(params, { where: condition });
        } else {
            throw new Error(constants.MESSAGES.request_validation_message);
        }
    } else {
        throw new Error(constants.MESSAGES.model_name_required);
    }

    return deleteQueryServiceData;
}

export const deleteModel = async (model: any,) => {
    let deleteQueryServiceData
    if (!_.isEmpty(model)) {
        deleteQueryServiceData = await model.destroy();
    } else {
        throw new Error(constants.MESSAGES.model_name_required);
    }

    return deleteQueryServiceData;
}
