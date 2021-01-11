import * as constants from "../constants";
import _ from "lodash";


/*
* function for delete details 
* @req : token, data
*
*/
export const deleteData = async (params: any, condition: any) => {
    if (!_.isEmpty(params.model)) {
        if (!_.isEmpty(params) && !_.isEmpty(condition)) {
            let model = params.model;
            var deleteQueryServiceData = await model.destroy(params, { where: condition });
        } else {
            throw new Error(constants.MESSAGES.request_validation_message);
        }
    } else {
        throw new Error(constants.MESSAGES.model_name_required);
    }

    return deleteQueryServiceData;
}
