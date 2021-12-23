import * as constants from "../constants";
import _ from "lodash";


/*
* function for add details 
* @req : token, data
*
*/
export const addData = async (model: any, data: any) => {
    let addQueryServiceData
    if (!_.isEmpty(model)) {
        if (!_.isEmpty(data)) {
            addQueryServiceData = await model.create(data);
        } else {
            throw new Error(constants.MESSAGES.request_validation_message);
        }
    } else {
        throw new Error(constants.MESSAGES.model_name_required);
    }

    return addQueryServiceData;
}
