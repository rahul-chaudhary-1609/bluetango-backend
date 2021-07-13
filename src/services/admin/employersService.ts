import { employersModel, industryTypeModel, employeeModel, departmentModel, adminModel } from "../../models";
import { subscriptionManagementModel } from "../../models/subscriptionManagement";
import { paymentManagementModel } from "../../models/paymentManagement";
import { coachManagementModel } from "../../models/coachManagement";
import { contactUsModel } from "../../models/contactUs";
import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import { where, Model } from "sequelize/types";
import { AnyAaaaRecord, AnyPtrRecord } from "dns";
import { employeeTokenResponse } from "../../utils/tokenResponse";
import { sequelize } from "../../connection";
import { now } from "sequelize/types/lib/utils";
import { managerTeamMemberModel } from "../../models/managerTeamMember";
import { libraryManagementModel } from "../../models/libraryManagement";
import { articleManagementModel } from "../../models/articleManagement";
import { advisorManagementModel } from "../../models/advisorManagement"
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
        params.email = params.email.toLowerCase();
        var isEmail = await appUtils.CheckEmail(params);
        const qry = <any>{ where: {} };
        if (isEmail) {
            qry.where = {
                email: params.email,
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
                if (!params.password) {
                    throw new Error(constants.MESSAGES.password_not_provided)
                }
                const password = params.password
                params.password = await appUtils.bcryptPassword(params.password);
                const employer = await employersModel.create(params);
                const mailParams = <any>{};
                mailParams.to = params.email;
                mailParams.html = `Hi  ${params.name}
                <br> Please download the app by clicking on link below and use the given credentials for login into the app :
                <br><br><b> Android URL</b>: ${process.env.EMPLOYER_ANDROID_URL}
                <br><b> IOS URL</b>: ${process.env.EMPLOYER_IOS_URL} <br>
                <br><b> Web URL</b>: ${process.env.EMPLOYER_WEB_URL} <br>
                <br> username : ${params.email}
                <br> password : ${password}
                `;
                mailParams.subject = "Employer Login Credentials";
                await helperFunction.sendEmail(mailParams);
                return employer
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
        employersModel.hasMany(employeeModel, { foreignKey: "current_employer_id" })
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        var whereCond: any = {};
        if (params.searchKey) {
            whereCond["name"] = { [Op.iLike]: `%${params.searchKey}%` }

        }
        if (params.industry_type) {
            whereCond["industry_type"] = params.industry_type
        }

        whereCond["status"] = { [Op.or]: [0, 1] }

        if (params.isPagination === "false") {
            return await employersModel.findAndCountAll({
                where: { status: 1 },
                attributes: ["id", "name"],
                order: [["name", "ASC"]]
            })
        }

        const employer = await employersModel.findAll({
            include: [
                {
                    model: employeeModel,
                    required: false,
                    attributes: ["id"],
                    where: {
                        status:[0,1]
                    }
                }
            ],
            where: whereCond,
            limit: limit,
            offset: offset,
            order: [["id", "DESC"]]


        })

        const countEmployer = await employersModel.count({ where: whereCond })
        return { employer, count: countEmployer }
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

        // let admin_id = params.admin_id

        rawQuery = `SELECT * FROM "employers" AS "employers" 
            WHERE "employers"."status" = 1 AND
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
        // let where = {
        //     admin_id: params.admin_id
        // }
        //var employerId = []
        //const employers = await employersModel.findAndCountAll({ where: where, raw: true })

        // for (let i = 0; i < employers.rows.length; i++) {
        //     employerId.push(employers.rows[i].id)

        // }

        // whereCond = {

        //     current_employer_id: { [Op.in]: employerId },
        //     status: 1

        // }
        if (params.employerName) {
            employer = {
                name: { [Op.iLike]: `%${params.employerName}%` },
                status: { [Op.or]: [0, 1] }
            }
        }

        if (params.departmentName) {
            department = {
                name: { [Op.iLike]: `%${params.departmentName}%` }
            }
        }

        if (params.searchKey) {
            whereCond = {
                //current_employer_id: { [Op.in]: employerId },
                name: { [Op.iLike]: `%${params.searchKey}%` },
            }
        }
        whereCond["status"] = { [Op.or]: [0, 1] }

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
            order: [["id", "DESC"]]
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

        if (params.description && !Array.isArray(params.description)) {
            params.description = JSON.parse(`[${params.description}]`);
        }
        return await subscriptionManagementModel.create(params);

    }

    /**
     * 
     * @param {} params pass all parameters from request
     */
    public async updateSubscriptionPlan(params: any) {

        const plans = await subscriptionManagementModel.update(params, { where: { id: params.id }, returning: true })

        if (plans && plans[1][0]) {
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
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        let where: any = {}
        if (params.status) {
            where.status = params.status

        } else {
            where.status = 1
            where = {
                status: { [Op.or]: [0, 1] }
            }
        }
        return await subscriptionManagementModel.findAndCountAll({
            where: where,
            limit: limit,
            offset: offset,
            order: [["id", "DESC"]]
        })

    }

    /**
    * 
    * @param {} params pass all parameters from request
    */
    public async viewPaymentList(params: any) {
        paymentManagementModel.belongsTo(employersModel, { foreignKey: "employer_id" })
        paymentManagementModel.belongsTo(subscriptionManagementModel, { foreignKey: "plan_id" })
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        let where: any = {}
        let whereCond: any = {}
        if (params.searchKey) {
            where = {
                name: { [Op.iLike]: `%${params.searchKey}%` }
            }
        }
        whereCond.status = 1
        //whereCond.admin_id = params.admin_id
        return await paymentManagementModel.findAndCountAll({
            where: whereCond,
            include: [
                {
                    model: employersModel,
                    required: true,
                    where: where,
                    attributes: ["id", "name"]
                },
                {
                    model: subscriptionManagementModel,
                    required: true,
                    attributes: ["id", "plan_name"]
                }
            ],
            attributes: ["id", "expiry_date"],
            limit: limit,
            offset: offset
        })

    }

    /**
     * 
     * @param {} params pass all parameters from request
     */
    public async viewPaymentDetails(params: any) {
        paymentManagementModel.belongsTo(employersModel, { foreignKey: "employer_id" })
        employersModel.hasMany(employeeModel, { foreignKey: "current_employer_id" })
        paymentManagementModel.belongsTo(subscriptionManagementModel, { foreignKey: "plan_id" })
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        let where: any = {}
        let whereCond: any = {}
        if (params.searchKey) {
            where = {
                name: { [Op.iLike]: `%${params.searchKey}%` }
            }
        }
        //whereCond.status = 1
        whereCond.id = params.id
        // whereCond.admin_id = params.admin_id
        return await paymentManagementModel.findOne({
            where: whereCond,
            include: [
                {
                    model: employersModel,
                    required: false,
                    where: where,
                    include: [{
                        model: employeeModel,
                        required: false,
                        attributes: ["id", "name"]
                    }]
                },
                {
                    model: subscriptionManagementModel,
                    required: false,
                    attributes: ["id", "plan_name"]
                }
            ],
            limit: limit,
            offset: offset
        })

    }


    /**
    * 
    * @param {} params pass all parameters from request
    */
    public async exportCsv(params: any) {
        paymentManagementModel.belongsTo(employersModel, { foreignKey: "employer_id" })
        paymentManagementModel.belongsTo(subscriptionManagementModel, { foreignKey: "plan_id" })
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        let where: any = {}
        let whereCond: any = {}
        if (params.searchKey) {
            where = {
                name: { [Op.iLike]: `%${params.searchKey}%` }
            }
        }
        whereCond.status = 1
        //whereCond.admin_id = params.admin_id
        return await paymentManagementModel.findAndCountAll({
            where: whereCond,
            include: [
                {
                    model: employersModel,
                    required: true,
                    where: where,
                    attributes: ["name"]
                },
                {
                    model: subscriptionManagementModel,
                    required: true,
                    attributes: ["id", "plan_name"]
                }
            ],
            attributes: ["id", "expiry_date"],
            limit: limit,
            offset: offset,
            raw: true
        })

    }

    /* 
    * @param {} params pass all parameters from request
    */
    public async employerDetails(params: any) {
        employersModel.hasMany(employeeModel, { foreignKey: "current_employer_id" })
        //employersModel.belongsTo(industryTypeModel, { foreignKey: "industry_type", as: "Industry_type" })
       // employersModel.hasOne(industryTypeModel, { foreignKey: "id", sourceKey: "industry_type", targetKey: "id" })
        
        let where: any = {}
        where.id = params.employerId

        const employer = await employersModel.findOne({
            where: where,
            include: [
                {
                    model: employeeModel,
                    required: false,
                    attributes: ["id"]
                }
                // {
                //     model: industryTypeModel,
                //     required: false,
                //     attributes: ["id", "name"]
                // }
            ]
        })
        
        if (employer) {
        const industry = await industryTypeModel.findOne({where: {id: employer.industry_type}})
        //employer.industry_name = industry.name            
            return {employer, industry}
        }
        else {
            throw new Error(constants.MESSAGES.employer_notFound);
        }

    }

    /**
    * add/ update coach management
    @param {} params pass all parameters from request
    */
    public async addEditCoach(params: any, user: any) {
        params.email = params.email.toLowerCase();
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
            existingUser = await coachManagementModel.findOne({
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
            existingUser = await coachManagementModel.findOne({
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
                let updateData = await coachManagementModel.update(params, {
                    where: { id: params.id }
                });
                if (updateData) {
                    return await coachManagementModel.findOne({
                        where: { id: params.id }
                    })
                } else {
                    return false;
                }
            } else {
                if (!params.password) {
                    throw new Error(constants.MESSAGES.password_not_provided)
                }
                const password = params.password
                params.password = await appUtils.bcryptPassword(params.password);
                const coach = await coachManagementModel.create(params);
                const mailParams = <any>{};
                mailParams.to = params.email;
                mailParams.html = `Hi  ${params.name}
                <br> Please download the app by clicking on link below and use the given credentials for login into the app :
                <br><br><b> Android URL</b>: ${process.env.COACH_ANDROID_URL}
                <br><b> IOS URL</b>: ${process.env.COACH_IOS_URL} <br>
                <br> username : ${params.email}
                <br> password : ${password}
                `;
                mailParams.subject = "Coach Login Credentials";
                await helperFunction.sendEmail(mailParams);
                return coach
            }

        } else {
            throw new Error(constants.MESSAGES.email_phone_already_registered);
        }
    }

    /**
   * 
   * @param {} params pass all parameters from request
   */
    public async getCoachList(params: any) {

        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        let where: any = {}

        if (params.searchKey) {
            where["name"] = { [Op.iLike]: `%${params.searchKey}%` }
        }
        where["status"] = 1
        return await coachManagementModel.findAndCountAll({
            where: where,
            attributes: ["id", "name", "email", "phone_number"],
            limit: limit,
            offset: offset,
            order: [["id", "DESC"]]
        })

    }

    /**
  * 
  * @param {} params pass all parameters from request
  */
    public async getCoachDetails(params: any) {

        let where = {
            id: params.coachId,
            status: 1
        }
        const coach = await coachManagementModel.findOne({
            where: where,
            attributes: ["id", "name", "email", "phone_number", "country_code", "description", "image", "fileName"],
        })
        if (coach) {
            return coach
        }
        else {
            throw new Error(constants.MESSAGES.coach_not_found)
        }

    }

    /**
  * 
  * @param {} params pass all parameters from request
  */
    public async deleteCoach(params: any) {
        let where = {
            id: params.coachId
        }
        let update = {
            status: 2
        }
        const coach = await coachManagementModel.update(update, { where: where, returning: true })

        if (coach && coach[1][0]) {
            return coach
        } else {
            throw new Error(constants.MESSAGES.coach_not_found);

        }

    }

    /**
  * 
  * @param {} params pass all parameters from request
  */
    public async getCotactUsList(params: any) {

        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)

        contactUsModel.belongsTo(employersModel, { foreignKey: "employer_id" })
        contactUsModel.belongsTo(employeeModel, { foreignKey: "employee_id" })

        return await contactUsModel.findAndCountAll({
            include: [
                {
                    model: employersModel,
                    required: false,
                    attributes: ["id", "name"]
                },
                {
                    model: employeeModel,
                    required: false,
                    attributes: ["id", "name"]
                }
            ]
        })
    }

    /**
  * 
  * @param {} params pass all parameters from request
  */
    public async getCotactUsDetails(params: any) {

        let where = {
            id: params.constactId
        }

        contactUsModel.belongsTo(employersModel, { foreignKey: "employer_id" })
        contactUsModel.belongsTo(employeeModel, { foreignKey: "employee_id" })

        return await contactUsModel.findOne({
            where: where,
            include: [
                {
                    model: employersModel,
                    required: false,
                    attributes: ["id", "name"]
                },
                {
                    model: employeeModel,
                    required: false,
                    attributes: ["id", "name"]
                }
            ]
        })
    }

    /**
 * 
 * @param {} params pass all parameters from request
 */
    public async sendEmailAndNotification(params: any) {
        let where: any = {}
        where.status = 1
        let receiver: any = {};
        if (params.receiver == "employer") {
            receiver = await employersModel.findAll({ where: where })
        }
        else if (params.receiver == "employee") {
            receiver = await employeeModel.findAll({ where: where })
        }

        let toMails = []
        let tokens = []
        receiver.forEach(rec => {
            toMails.push(rec.email)
            if (rec.device_token !== null) {
                tokens.push(rec.device_token)
            }
        });

        if (params.notification_type == 0) {
            await this.sendBulkEmail(toMails, params.message)
        }
        else if (params.notification_type == 1) {
            await this.sendBulkNotification(tokens, params.message)
        }
        else if (params.notification_type == 2) {
            await this.sendBulkEmail(toMails, params.message)
            await this.sendBulkNotification(tokens, params.message)
        }

    }

    public async sendBulkEmail(toMails, message) {
        const mailParams = <any>{};

        mailParams.to = toMails;
        mailParams.subject = "Email notification from admin";
        mailParams.html = `${message}`

        return await helperFunction.sendEmail(mailParams);

    }

    public async sendBulkNotification(tokens, message) {

        let notificationData = <any>{
            title: 'In-App notification from admin',
            body: `${message}`,
            data: {}
        }
        return await helperFunction.sendFcmNotification(tokens, notificationData);
    }


    /* 
    * @param {} params pass all parameters from request
    */
    public async employeeDetails(params: any) {
        employeeModel.belongsTo(employersModel, { foreignKey: "current_employer_id" })
        employeeModel.belongsTo(departmentModel, { foreignKey: "current_department_id" })
        employeeModel.hasOne(managerTeamMemberModel, { foreignKey: "team_member_id", sourceKey: "id", targetKey: "team_member_id" })
        managerTeamMemberModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "manager_id", targetKey: "id" })
        let where: any = {}
        where.id = params.employeeId

        const employee = await employeeModel.findOne({
            where: where,
            include: [
                {
                    model: employersModel,
                    required: false,
                    attributes: ["id", "name"]
                },
                {
                    model: departmentModel,
                    required: false,
                    attributes: ["id", "name"]
                },
                {
                    model: managerTeamMemberModel,
                    required: false,
                    include: [{
                        model: employeeModel,
                        required: false,
                        attributes: ["id", "name"]
                    }]
                    //attributes: ["id","name"]
                }
            ]
        })

        if (employee) {
            return employee
        }
        else {
            throw new Error(constants.MESSAGES.employee_notFound);
        }

    }

    /**
    * 
    * @param {} params pass all parameters from request
    */
    public async getDepartmentList(params: any) {

        return await departmentModel.findAll({})
    }

    /**
    * 
    * @param {} params pass all parameters from request
    */
    public async subscriptionDetails(params: any) {

        return await subscriptionManagementModel.findOne({ where: { id: params.subscriptionId } })
    }

    /**
    * change employee status: activate/deactivate/delete
    @param {} params pass all parameters from request
    */
    public async changeSubsPlanStatus(params: any) {
        let query: any = {}
        query.id = params.subscriptionId;

        let accountExists = await subscriptionManagementModel.findOne({ where: query });
        //console.log('accExist - - - ', accountExists)
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

            const subscription = await subscriptionManagementModel.update(updates, { where: query, returning: true });
            console.log('subscription - - ', subscription)
            return subscription[1][0]

        } else {
            throw new Error(constants.MESSAGES.invalid_plan);
        }
    }

    /**
   * 
   * @param {} params pass all parameters from request
   */
    public async getSubAdminList(params: any) {

        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        let where: any = {}

        if (params.searchKey) {
            where["name"] = { [Op.iLike]: `%${params.searchKey}%` }
        }
        where["status"] = 1
        where["admin_role"] = 2
        return await adminModel.findAndCountAll({
            where: where,
            attributes: ["id", "name", "email", "phone_number", "country_code"],
            limit: limit,
            offset: offset,
            order: [["id", "DESC"]]
        })

    }

    /**
  * 
  * @param {} params pass all parameters from request
  */
    public async subAdminDetails(params: any) {

        let where: any = {}

        where["status"] = 1
        where["admin_role"] = 2
        where["id"] = params.subAdminId
        const subAdmin = await adminModel.findOne({
            where: where,
        })
        if (subAdmin) {
            return subAdmin
        } else {
            throw new Error(constants.MESSAGES.subAdmin_not_found)
        }

    }

    /*
   * function to upload file 
   */
    public async uploadFile(params: any, folderName) {
        return await helperFunction.uploadFile(params, folderName);
    }

    /**
  * 
  * @param {} params pass all parameters from request
  */
    public async addVideo(params: any) {

        return await libraryManagementModel.create(params)

    }

    /**
  * 
  * @param {} params pass all parameters from request
  */
    public async editVideo(params: any) {

        const library = await libraryManagementModel.update(params, { where: { id: params.id }, returning: true })
        if (library && library[1][0]) {
            return library[1][0]
        } else {
            throw new Error(constants.MESSAGES.invalid_library)
        }

    }

    /**
 * 
 * @param {} params pass all parameters from request
 */
    public async listVideo(params: any) {
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)

        return await libraryManagementModel.findAndCountAll({
            where: { status: 1 },
            limit: limit,
            offset: offset,
            order: [["id", "DESC"]]
        })

    }

    /**
 * 
 * @param {} params pass all parameters from request
 */
    public async detailsVideo(params: any) {

        let where: any = {}
        where.id = params.id
        where.status = 1
        const library = await libraryManagementModel.findOne({
            where: where
        })
        if (library) {
            return library
        } else {
            throw new Error(constants.MESSAGES.invalid_library)
        }

    }

    /**
  * 
  * @param {} params pass all parameters from request
  */
    public async addArticle(params: any) {

        return await articleManagementModel.create(params)

    }


    /**
    * 
    * @param {} params pass all parameters from request
    */
    public async updateArticle(params: any) {
        let where: any = {}
        where.id = params.id
        const article = await articleManagementModel.update(params, { where: where, returning: true });
        if (article && article[1][0]) {
            return article[1][0]
        } else {
            throw new Error(constants.MESSAGES.invalid_article)
        }

    }

    /**
    * 
    * @param {} params pass all parameters from request
    */
    public async editArticle(params: any) {

        let ids = JSON.parse(params.id)
        let update: any = {}
        update.status = 2
        let where: any = {}
        where.id = params.id
        const article = await articleManagementModel.update({ status: 2 }, { where: { id: ids }, returning: true });
        if (article && article[1][0]) {
            return article[1]
        } else {
            throw new Error(constants.MESSAGES.invalid_article)
        }

    }

    /**
    * 
    * @param {} params pass all parameters from request
    */
    public async listArticle(params: any) {
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)

        return await articleManagementModel.findAndCountAll({
            where: { status: 1 },
            limit: limit,
            offset: offset,
            order: [["id", "DESC"]]
        })

    }

    /**
    * 
    * @param {} params pass all parameters from request
    */
    public async detailsArticle(params: any) {

        let where: any = {}
        where.id = params.id
        where.status = 1
        const article = await articleManagementModel.findOne({
            where: where
        })
        if (article) {
            return article
        } else {
            throw new Error(constants.MESSAGES.invalid_article)
        }

    }

    /**
  * 
  * @param {} params pass all parameters from request
  */
    public async addAdvisor(params: any) {

        return await advisorManagementModel.create(params)

    }


    /**
    * 
    * @param {} params pass all parameters from request
    */
    public async updateAdvisor(params: any) {
        let where: any = {}
        where.id = params.id
        const advisor = await advisorManagementModel.update(params, { where: where, returning: true });
        if (advisor && advisor[1][0]) {
            return advisor[1][0]
        } else {
            throw new Error(constants.MESSAGES.invalid_advisor)
        }

    }

    /**
    * 
    * @param {} params pass all parameters from request
    */
    public async listAdvisor(params: any) {
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)

        return await advisorManagementModel.findAndCountAll({
            where: { status: 1 },
            limit: limit,
            offset: offset,
            order: [["id", "DESC"]]
        })

    }

    /**
    * 
    * @param {} params pass all parameters from request
    */
    public async deleteAdvisor(params: any) {
        let ids = JSON.parse(params.id)
        let update: any = {}
        update.status = 2
        let where: any = {}
        where.id = { [Op.in]: params.id }
        const advisor = await advisorManagementModel.update({ status: 2 }, { where: { id: ids }, returning: true });
        if (advisor && advisor[1][0]) {
            return advisor[1]
        } else {
            throw new Error(constants.MESSAGES.invalid_advisor)
        }

    }

    /**
    * 
    * @param {} params pass all parameters from request
    */
    public async detailsAdvisor(params: any) {

        let where: any = {}
        where.id = params.id
        where.status = 1
        const article = await advisorManagementModel.findOne({
            where: where
        })
        if (article) {
            return article
        } else {
            throw new Error(constants.MESSAGES.invalid_advisor)
        }

    }

    public async findAdminById(params: any) {
        let where: any = {}
        where.id = params.uid
        where.status = 2
        return await adminModel.findOne({where: where})
    }

}
