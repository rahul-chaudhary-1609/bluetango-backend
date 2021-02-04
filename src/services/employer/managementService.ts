import { employeeModel, employersModel, departmentModel } from "../../models";
import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
const Sequelize = require('sequelize');
import {managerTeamMemberModel} from "../../models/managerTeamMember";
var Op = Sequelize.Op;

export class EmployeeManagement {
    constructor() { }

    /**
    * add edit employee function
    @param {} params pass all parameters from request
    */
    public async addEditEmployee(params: any, user: any) {
        if(params.current_department_id) {
            let departmentExists = await departmentModel.findOne({where:{id: params.current_department_id}});
            if(!departmentExists)
            throw new Error(constants.MESSAGES.invalid_department);
        }
        var existingUser; 
        if (params.id) {
            existingUser = await employeeModel.findOne({
                where: {
                    email: params.email,
                    status: {
                        [Op.in]: [0,1]
                    },
                    id: {
                        [Op.ne]: params.id
                    }
                }
            });
        } else {
            existingUser = await employeeModel.findOne({
                where: {
                    email: params.email,
                    status: {
                        [Op.in]: [0,1]
                    }
                }
            });
        }       

        params.current_employer_id = user.uid;
        if (_.isEmpty(existingUser)) {
          if (params.id) {
              delete params.password;
            let updateData =  await employeeModel.update( params, {
                where: { id: params.id}
            });
            if (updateData) {
                return await employeeModel.findOne({
                    where: {id: params.id}
                })
            } else {
                return false;
            }
          } else {

            // if is_manager=0 then manager_id must be required
            if (params.is_manager== 0 ||params.is_manager== '0') {
                console.log(params.manager_id, _.isEmpty(params.manager_id),  typeof(params.manager_id) == 'undefined' )
                if (typeof(params.manager_id) == 'undefined') {
                    throw new Error(constants.MESSAGES.manager_id_required);
                }
            }

            params.password = await appUtils.bcryptPassword(params.password);
            let employeeRes = await employeeModel.create(params);
            if (params.is_manager== 0 ||params.is_manager== '0') {
                let teamMemberObj = <any> {
                    team_member_id: employeeRes.id,
                    manager_id: params.manager_id
                }

               await managerTeamMemberModel.create(teamMemberObj);
            }

            return employeeRes;
          }

        } else {
            throw new Error(constants.MESSAGES.email_already_registered);
        }
    }

    /**
    * get employee list function
    @param {} params pass all parameters from request
    */
    public async getEmployeeList (params: any, user: any) {
        if(params.departmentId) {
            let departmentExists = await departmentModel.findOne({where:{id: params.departmentId}});
            if(!departmentExists)
            throw new Error(constants.MESSAGES.invalid_department);
        }
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        let whereCond = <any>{};
        whereCond.current_employer_id = user.uid;
        if (params.departmentId) {
            whereCond = {
                ...whereCond,
                current_department_id: params.current_department_id
            }
        }

        return await employeeModel.findAndCountAll({
            where: whereCond,
            limit: limit,
            offset: offset,
            order: [["createdAt", "DESC"]]
        })

    }

}