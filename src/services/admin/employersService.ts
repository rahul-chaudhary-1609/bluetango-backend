import { employersModel, industryTypeModel, employeeModel, departmentModel } from "../../models";
import { subscriptionManagementModel } from "../../models/subscriptionManagement";
import { paymentManagementModel } from "../../models/paymentManagement"
import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import { where, Model } from "sequelize/types";
import { AnyAaaaRecord } from "dns";
import { employeeTokenResponse } from "../../utils/tokenResponse";
import { sequelize } from "../../connection";
import { now } from "sequelize/types/lib/utils";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;


export class EmployersService {
    constructor() { }

    /**
    * get employers industry type list
    @param {} params pass all parameters from request
    */
    public async getIndustryTypeList(params: any) {
        return await industryTypeModel.findAndCountAll({
            where: {},
            order: [["name", "ASC"]]
        })
    }

    /**
    * add edit employers function
    @param {} params pass all parameters from request
    */
    public async addEditEmployers(params: any, user: any) {
        var isEmail = await appUtils.CheckEmail(params);
        const qry = <any>{ where: {} };
        if (isEmail) {
            qry.where = {
                email: params.username,
                status: { [Op.in]: [0, 1] }
            };
        }
        var existingUser;
        if (params.id) {
            existingUser = await employersModel.findOne({
                where: {
                    [Op.or]: [
                        { email: params.email },
                        { phone_number: params.phone_number },
                    ],
                    status: {
                        [Op.in]: [0, 1]
                    },
                    id: {
                        [Op.ne]: params.id
                    }
                }
            });
        } else {
            existingUser = await employersModel.findOne({
                where: {
                    [Op.or]: [
                        { email: params.email },
                        { phone_number: params.phone_number },
                    ],
                    status: {
                        [Op.in]: [0, 1]
                    }
                }
            });
        }
        params.admin_id = user.uid;
        if (_.isEmpty(existingUser)) {
            if (params.id) {
                delete params.password;
                let updateData = await employersModel.update(params, {
                    where: { id: params.id }
                });
                if (updateData) {
                    return await employersModel.findOne({
                        where: { id: params.id }
                    })
                } else {
                    return false;
                }
            } else {
                if(!params.password) {
                    throw new Error(constants.MESSAGES.password_not_provided)
                }
                
                params.password = await appUtils.bcryptPassword(params.password);
                return await employersModel.create(params);
            }

        } else {
            throw new Error(constants.MESSAGES.email_phone_already_registered);
        }
    }

    /**
    * get employers list function
    @param {} params pass all parameters from request
    */
    public async getEmployersList(params: any) {
        employersModel.hasMany(employeeModel, {foreignKey: "current_employer_id"})
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        var whereCond:any = {};
        if (params.searchKey) {
            whereCond["name"] = { [Op.iLike]: `%${params.searchKey}%` }
            
        }
        if (params.industry_type) {
            whereCond["industry_type"] = params.industry_type
        }

        whereCond["status"] = {[Op.or]: [0,1]}
         
            const employer = await employersModel.findAll({
            include: [{model: employeeModel, required: false, attributes: ["id"]}],
            where: whereCond,
            limit: limit,
            offset: offset,
            order: [["createdAt", "DESC"]]

            
        })

        const countEmployer = await employersModel.count({where: whereCond})
        return{employer,count:countEmployer}
    }

    /**
    * change employers status: activate/deactivate/delete
    @param {} params pass all parameters from request
    */
    public async changeEmployerStatus(params: any) {
        let query = { where: { id: params.employerId } };
        let accountExists = await employersModel.findOne(query);
        if (accountExists) {
            let updates = <any>{};
            if (params.actionType == "activate") {
                if (accountExists && accountExists.status == 1)
                    throw new Error(constants.MESSAGES.already_activated);

                updates.status = 1;
            } else if (params.actionType == "deactivate") {
                if (accountExists && accountExists.status == 0)
                    throw new Error(constants.MESSAGES.already_deactivated);

                updates.status = 0;
            } else if (params.actionType == "delete") {
                if (accountExists && accountExists.status == 2)
                    throw new Error(constants.MESSAGES.already_deleted);

                updates.status = 2;
            } else {
                throw new Error(constants.MESSAGES.invalid_action);
            }

            await employersModel.update(updates, query);

        } else {
            throw new Error(constants.MESSAGES.invalid_employer);
        }
    }

    /**
    * get dashboard analytics count
    @param {} params pass all parameters from request
    */
    public async dashboardAnalytics(params) {

        let rawQuery = ""
        let where: any = {}
        let employees;
       
        let admin_id = params.admin_id

        rawQuery = `SELECT * FROM "employers" AS "employers" 
            WHERE "employers"."admin_id" = ${admin_id} AND "employers"."status" = 1 AND
             "employers"."createdAt" BETWEEN date '${params.from}'
             AND date '${params.to}'
              `

        let employers = await sequelize.query(rawQuery, {
            raw: true
        });    

        let employerCount = employers[0] ? employers[0].length : 0

        rawQuery = `SELECT * FROM "employee" AS "employees" 
        WHERE "employees"."status" = 1 AND
         "employees"."createdAt" BETWEEN date '${params.from}'
         AND date '${params.to}'`

         employees = await sequelize.query(rawQuery, {
            raw: true
        });

        let employeeCount = employees[0] ? employees[0].length : 0
        
        return { employers: employerCount, employees: employeeCount }
        
    }


    /**
    * get employers list function
    @param {} params pass all parameters from request
    */
    public async getEmployeeList(params: any) {
        employeeModel.belongsTo(employersModel, { foreignKey: "current_employer_id" })

        employeeModel.belongsTo(departmentModel, { foreignKey: "current_department_id" })

        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        var whereCond: any = {};
        var employer: any = {};
        var department: any = {};
        let where = {
            admin_id: params.admin_id
        }
        var employerId = []
        const employers = await employersModel.findAndCountAll({ where: where, raw: true })

        for (let i = 0; i < employers.rows.length; i++) {
            employerId.push(employers.rows[i].id)

        }

        whereCond = {

            current_employer_id: { [Op.in]: employerId },
            status: 1

        }
        if (params.employerName) {
            employer = {
                name: { [Op.iLike]: `%${params.employerName}%` },
                status: 1
            }
        }

        if (params.departmentName) {
            department = {
                name: { [Op.iLike]: `%${params.departmentName}%` }
            }
        }

        if (params.searchKey) {
            whereCond = {
                current_employer_id: { [Op.in]: employerId },
                name: { [Op.iLike]: `%${params.searchKey}%` },
                status: 1
            }
        } 

        return await employeeModel.findAndCountAll({
            where: whereCond,
            include: [
                {
                    model: employersModel,
                    where: employer,
                    required: true,
                    attributes: ["id", "name"]
                },
                {
                    model: departmentModel,
                    where: department,
                    required: true,
                    attributes: ["id", "name"]
                }
            ],
            limit: limit,
            offset: offset,
            order: [["createdAt", "DESC"]]
        })

    }


    /**
    * change employee status: activate/deactivate/delete
    @param {} params pass all parameters from request
    */
    public async changeEmployeeStatus(params: any) {
        let query = { where: { id: params.employeeId } };

        let accountExists = await employeeModel.findOne(query);
        if (accountExists) {
            let updates = <any>{};
            if (params.actionType == "activate") {
                if (accountExists && accountExists.status == 1)
                    throw new Error(constants.MESSAGES.already_activated);

                updates.status = 1;
            } else if (params.actionType == "deactivate") {
                if (accountExists && accountExists.status == 0)
                    throw new Error(constants.MESSAGES.already_deactivated);

                updates.status = 0;
            } else if (params.actionType == "delete") {
                if (accountExists && accountExists.status == 2)
                    throw new Error(constants.MESSAGES.already_deleted);

                updates.status = 2;
            } else {
                throw new Error(constants.MESSAGES.invalid_action);
            }

            await employeeModel.update(updates, query);

        } else {
            throw new Error(constants.MESSAGES.invalid_employee);
        }
    }

    /**
   * edit employee details
   @param {} params pass all parameters from request
   */
    public async editEmployeeDetails(params: any) {

        let query: any = {}
        if (params.employerId) {
            query = { where: { id: params.employerId } };
            let employerExists = await employersModel.findOne(query);
            if (!employerExists) {
                throw new Error(constants.MESSAGES.invalid_employer);
            }
            params.current_employer_id = employerExists.id
        }
        if (params.departmentId) {
            query = { where: { id: params.departmentId } };
            let departmentExists = await departmentModel.findOne(query);
            if (!departmentExists) {
                throw new Error(constants.MESSAGES.invalid_department);
            }
            params.current_department_id = departmentExists.id
        }
        if (params.status) {
            let status: any = [0, 1, 2]
            if (!status.includes(JSON.parse(params.status))) {
                throw new Error(constants.MESSAGES.invalid_action);
            }
        }

        const updateEmployee = await employeeModel.update(params, { where: { id: params.id }, raw: true, returning: true })
        if (updateEmployee[0] == 0) {
            throw new Error(constants.MESSAGES.invalid_employee);
        }
        return updateEmployee
    }

    /**
     * 
     * @param {} params pass all parameters from request
     */
    public async addSubscriptionPlan(params: any) {

            return await subscriptionManagementModel.create(params);
        
    }

    /**
     * 
     * @param {} params pass all parameters from request
     */
    public async updateSubscriptionPlan(params: any) {

            const plans = await subscriptionManagementModel.update(params, { where: { id: params.id }, returning: true })
           
            if(plans && plans[1][0]) {
                return plans[1][0]
            }
            else {
                throw new Error(constants.MESSAGES.plan_notFound);
            }
        
    }

    /**
     * 
     * @param {} params pass all parameters from request
     */
    public async viewSubscriptionPlan(params: any) {
        let where:any = {}
        if (params.status) {
                where.status = params.status
        
        }else {
            where.status = 1
        }
            return await subscriptionManagementModel.findAll({where: where})
        
    }

     /**
     * 
     * @param {} params pass all parameters from request
     */
    public async viewPaymentList(params: any) {
        paymentManagementModel.belongsTo(employersModel, {foreignKey: "employer_id"})
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        let where:any = {}
        let whereCond:any = {}
        if (params.searchKey) {
            where = {
                name: { [Op.iLike]: `%${params.searchKey}%` }
            }
        }
        whereCond.status = 1
        whereCond.admin_id = params.admin_id
         return await paymentManagementModel.findAndCountAll({
             where: whereCond,
             include: [{
                model: employersModel,
                required: true,
                where: where,
                attributes: ["name"]
                }],
            attributes: ["plan_type", "expiry_date"],
             limit: limit,
             offset: offset
         })   
        
    }

    /**
     * 
     * @param {} params pass all parameters from request
     */
    public async viewPaymentDetails(params: any) {
        paymentManagementModel.belongsTo(employersModel, {foreignKey: "employer_id"})
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        let where:any = {}
        let whereCond:any = {}
        if (params.searchKey) {
            where = {
                name: { [Op.iLike]: `%${params.searchKey}%` }
            }
        }
        whereCond.status = 1
        whereCond.employer_id = params.employerId
        whereCond.admin_id = params.admin_id
         return await paymentManagementModel.findOne({
             where: whereCond,
             include: [{
                model: employersModel,
                required: true,
                where: where,
                }],
             limit: limit,
             offset: offset
         })   
        
    }


     /**
     * 
     * @param {} params pass all parameters from request
     */
    public async exportCsv(params: any) {
        paymentManagementModel.belongsTo(employersModel, {foreignKey: "employer_id"})
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        let where:any = {}
        let whereCond:any = {}
        if (params.searchKey) {
            where = {
                name: { [Op.iLike]: `%${params.searchKey}%` }
            }
        }
        whereCond.status = 1
        whereCond.admin_id = params.admin_id
         return await paymentManagementModel.findAndCountAll({
             where: whereCond,
             include: [{
                model: employersModel,
                required: true,
                where: where,
                attributes: ["name"]
                }],
            attributes: ["plan_type", "expiry_date"],
             limit: limit,
             offset: offset
         })   
        
    }


}