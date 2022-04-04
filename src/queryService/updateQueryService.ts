import * as constants from "../constants";
import _ from "lodash";


/*
* function for update details 
* @req : token, data
*
*/
export const updateData = async (params: any, condition: any) => {
    let updateQueryServiceData
    console.log('params - - ',params, 'cond - - ', condition)
    if (!_.isEmpty(params.model)) {
        if (!_.isEmpty(params) && !_.isEmpty(condition)) {
            let model = params.model;
            updateQueryServiceData = await model.update(params, { where: condition });
        } else {
            throw new Error(constants.MESSAGES.request_validation_message);
        }
    } else {
        throw new Error(constants.MESSAGES.model_name_required);
    }

    return updateQueryServiceData;
}
