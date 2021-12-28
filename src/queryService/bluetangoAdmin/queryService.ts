import * as constants from "../../constants";
import _ from "lodash";
import { rawQuery } from "../../connection";


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
            updateQueryServiceData = await model.update(params, condition);
        } else {
            throw new Error(constants.MESSAGES.request_validation_message);
        }
    } else {
        throw new Error(constants.MESSAGES.model_name_required);
    }

    return updateQueryServiceData;
}

export const count = async (model: any, condition: any) => {
    try {
        let selectQueryServiceData;
        if (!_.isEmpty(model)) {
            if (!_.isEmpty(condition)) {
                selectQueryServiceData = await model.count(condition);
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

/*
* function for select details 
* @req : token, data
*
*/
export const selectOne = async (model: any, condition: any) => {
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

export const selectAll = async (model: any, condition: any, attributes: any={}) => {
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
