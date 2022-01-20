import { employersModel, industryTypeModel, employeeModel, departmentModel, adminModel } from "../../models";
import { coachManagementModel } from "../../models/coachManagement";
import { coachSpecializationCategoriesModel } from "../../models/coachSpecializationCategories";
import { employeeRanksModel } from "../../models/employeeRanks";
import { employeeCoachSessionsModel } from "../../models/employeeCoachSession";
import _ from "lodash";

import * as helperFunction from "../../utils/helperFunction";
import * as constants from "../../constants";
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const Sequelize = require('sequelize');
var Op = Sequelize.Op;


export class CoachService {
    constructor() { }

    public async addEditCoachSpecializationCategories(params:any){
        let category=null;

        if(params.category_id){
            category=await coachSpecializationCategoriesModel.findOne({
                where:{
                    name:{
                        [Op.iLike]:`%${params.name}%`
                    },
                    status:[constants.STATUS.active,constants.STATUS.inactive],
                    id:{
                        [Op.notIn]:[params.category_id],
                    }
                }
            })
        }else{
            category=await coachSpecializationCategoriesModel.findOne({
                where:{
                    name:{
                        [Op.iLike]:`%${params.name}%`
                    },
                    status:[constants.STATUS.active,constants.STATUS.inactive],
                }
            })
        }

        if(!category){
            if(params.category_id){
                let category=await coachSpecializationCategoriesModel.findOne({
                    where:{
                        id:params.category_id,
                    }
                })
    
                if(category){
                    category.name=params.name || category.name;
                    category.description=params.description || category.description;
    
                    category.save();
    
                    return await helperFunction.convertPromiseToObject(category);
                }else{
                    throw new Error(constants.MESSAGES.no_coach_specialization_category)
                }
            }else{
                let categoryObj=<any>{
                    name:params.name,
                    description:params.description,
                }

                return await helperFunction.convertPromiseToObject(await coachSpecializationCategoriesModel.create(categoryObj))
            }
        }else{
            throw new Error(constants.MESSAGES.coach_specialization_category_already_exist)
        }   
    }

    public async listCoachSpecializationCategories(params:any){

        let query=<any>{
            order: [["createdAt", "DESC"]]
        }
        query.where=<any>{
            status:{
                [Op.in]:[constants.STATUS.active,constants.STATUS.inactive]
            }
        }
        if(params.searchKey){
            query.where=<any>{
                ...query.where,
                name:{
                    [Op.iLike]:`%${params.searchKey}%`
                }
            }
        }

        if(!params.is_pagination || params.is_pagination==constants.IS_PAGINATION.yes){
            let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
            query.offset=offset,
            query.limit=limit            
        }

        let categories=await helperFunction.convertPromiseToObject(
            await coachSpecializationCategoriesModel.findAndCountAll(query)
        )

        if(categories.count==0){
            throw new Error(constants.MESSAGES.no_coach_specialization_category);
        }

        return categories;

    }

    public async getCoachSpecializationCategory(params:any){

        let category=await helperFunction.convertPromiseToObject(
            await coachSpecializationCategoriesModel.findOne({
                where:{
                    id:params.category_id,
                }
            })
        )

        if(!category){
            throw new Error(constants.MESSAGES.no_coach_specialization_category);
        }

        return category;

    }

    public async deleteCoachSpecializationCategory(params:any){
        let category=await coachSpecializationCategoriesModel.findOne({
            where:{
                id:params.category_id,
            }
        })

        if(!category){
            throw new Error(constants.MESSAGES.no_coach_specialization_category);
        }

        let coachCount=await coachManagementModel.count({
            where:{
                coach_specialization_category_ids:{
                    [Op.contains]:[category.id]
                }
            }
        })

        if(coachCount>0){
            throw new Error(constants.MESSAGES.coach_specialization_category_delete_error)
        }else{
            category.destroy();
            return true;
        }
    }

    public async addEditEmployeeRank(params:any){

        let rank=null;

        if(params.rank_id){
            rank=await employeeRanksModel.findOne({
                where:{
                    name:{
                        [Op.iLike]:`%${params.name}%`
                    },
                    status:[constants.STATUS.active,constants.STATUS.inactive],
                    id:{
                        [Op.notIn]:[params.rank_id],
                    }
                }
            })
        }else{
            rank=await employeeRanksModel.findOne({
                where:{
                    name:{
                        [Op.iLike]:`%${params.name}%`
                    },
                    status:[constants.STATUS.active,constants.STATUS.inactive],
                }
            })
        }

        if(!rank){
            if(params.rank_id){
                let rank=await employeeRanksModel.findOne({
                    where:{
                        id:params.rank_id,
                    }
                })
    
                if(rank){
                    rank.name=params.name || rank.name;
                    rank.description=params.description || rank.description;
    
                    rank.save();
    
                    return await helperFunction.convertPromiseToObject(rank);
                }else{
                    throw new Error(constants.MESSAGES.no_employee_rank)
                }
            }else{
                let rankObj=<any>{
                    name:params.name,
                    description:params.description,
                }

                return await helperFunction.convertPromiseToObject(await employeeRanksModel.create(rankObj))
            }
        }else{
            throw new Error(constants.MESSAGES.employee_rank_already_exist)
        }   
    }

    public async listEmployeeRanks(params:any){

        let query=<any>{
            order: [["createdAt", "DESC"]]
        };
        query.where=<any>{
            status:{
                [Op.in]:[constants.STATUS.active,constants.STATUS.inactive]
            }
        }
        if(params.searchKey){
            query.where=<any>{
                ...query.where,
                name:{
                    [Op.iLike]:`%${params.searchKey}%`
                }
            }
        }

        if(!params.is_pagination || params.is_pagination==constants.IS_PAGINATION.yes){
            let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
            query.offset=offset,
            query.limit=limit
        }

        let ranks=await helperFunction.convertPromiseToObject(
            await employeeRanksModel.findAndCountAll(query)
        )

        if(ranks.count==0){
            throw new Error(constants.MESSAGES.no_employee_rank);
        }

        return ranks;

    }

    public async getEmployeeRank(params:any){

        let rank=await helperFunction.convertPromiseToObject(
            await employeeRanksModel.findOne({
                where:{
                    id:params.rank_id,
                }
            })
        )

        if(!rank){
            throw new Error(constants.MESSAGES.no_employee_rank);
        }

        return rank;

    }

    public async deleteEmployeeRank(params:any){
        let rank=await employeeRanksModel.findOne({
            where:{
                id:params.rank_id,
            }
        })

        if(!rank){
            throw new Error(constants.MESSAGES.no_employee_rank);
        }

        let employeeCount=await employeeModel.count({
            where:{
                employee_rank_id:rank.id,
                status:constants.STATUS.active
            }
        })

        if(employeeCount>0){
            throw new Error(constants.MESSAGES.employee_rank_delete_employee_error)
        }else{
            let coachCount=await coachManagementModel.count({
                where:{
                    employee_rank_ids:{
                        [Op.contains]:[rank.id]
                    },
                    status:constants.STATUS.active
                }
            })
    
            if(coachCount>0){
                throw new Error(constants.MESSAGES.employee_rank_delete_coach_error)
            }else{
                rank.destroy();
                return true;
            }
        }
    }

    public async listEmployeeCoachSessions(params:any){
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)

        employeeCoachSessionsModel.hasOne(employeeModel,{foreignKey:"id",sourceKey:"employee_id",targetKey:"id"})
        employeeCoachSessionsModel.hasOne(coachManagementModel,{foreignKey:"id",sourceKey:"coach_id",targetKey:"id"})
        employeeCoachSessionsModel.hasOne(employeeRanksModel,{foreignKey:"id",sourceKey:"employee_rank_id",targetKey:"id"})
        employeeModel.hasOne(employersModel,{foreignKey:"id",sourceKey:"current_employer_id",targetKey:"id"})


        let where=<any>{
            // status:{
            //     [Op.notIn]:[constants.STATUS.deleted]
            // },
        }

        let employeeWhere=<any>{};
        let coachWhere=<any>{};
        let employeeRankWhere=<any>{};

        if(params.searchKey){
            
            coachWhere={
                ...coachWhere,
                name:{
                    [Op.iLike]:`%${params.searchKey}%`
                }
            }         

            
            let coaches=await coachManagementModel.findOne({
                where:coachWhere,
            })

            if(!coaches){
                coachWhere={};
                employeeWhere={
                    ...employeeWhere,
                    name:{
                        [Op.iLike]:`%${params.searchKey}%`
                    }
                }
            }else{
                employeeWhere={};
            }
            
        }

        // if(params.date){
        //     where={
        //         [Op.and]: [
        //             {
        //                 ...where,                      
        //             },
        //             Sequelize.where(Sequelize.fn('date', Sequelize.col('datetime')), '=', params.date),
        //         ]                
        //     }
        // }

        if(params.date){
            where={
                 ...where,   
                 date:params.date, 
            }
        }
        if(params.employer_ids){
            employeeWhere["current_employer_id"]=params.employer_ids
        }

        if(params.status){
            if([constants.EMPLOYEE_COACH_SESSION_STATUS.pending, constants.EMPLOYEE_COACH_SESSION_STATUS.accepted].includes(parseInt(params.status))){
                where={
                    ...where,
                    status:{
                        [Op.in]:[
                            constants.EMPLOYEE_COACH_SESSION_STATUS.pending,
                            constants.EMPLOYEE_COACH_SESSION_STATUS.accepted
                        ]
                    },
                }
            }else{
                where={
                    ...where,
                    status:parseInt(params.status),
                }
            }
        }

        if(params.employeeRankId){
            employeeRankWhere={
                ...employeeRankWhere,
                id:params.employeeRankId,
            }
        }

        if(params.sessionType){
            where={
                ...where,
                type:parseInt(params.sessionType),
            }
        }

        let sessions=await helperFunction.convertPromiseToObject(
            await employeeCoachSessionsModel.findAndCountAll({
                where,
                include:[
                    {
                        model:employeeModel,
                        attributes:['id','name'],
                        required:true,
                        where:employeeWhere,
                        include: [{
                            model: employersModel,
                            attributes: []
                        }]
                    },
                    {
                        model:coachManagementModel,
                        attributes:['id','name'],
                        required:true,
                        where:coachWhere
                    },
                    {
                        model:employeeRanksModel,
                        required:true,
                        where:employeeRankWhere
                    }
                ],
                limit,
                offset,
                order: [["createdAt", "DESC"]],
                attributes: [ "id",
                "coach_id",
                "employee_id",
                "employee_rank_id",
                "coach_specialization_category_id",
                "query",
                "coach_rating",
                "date",
                "start_time",
                "end_time",
                "slot_id",
                "call_duration",
                "comment",
                "cancelled_by",
                "cancel_reason",
                "amount",
                "type",
                "is_rating_skipped",
                "status","details","action_by",
                "action",
                "request_received_date",
                "timeline",
                "createdAt",
                "updatedAt",[Sequelize.col('employee.employer.name'), 'employer_name']]
            })
        )

        if(sessions.count==0) throw new Error(constants.MESSAGES.no_session)

        return sessions;
    }

    public async getEmployeeCoachSession(params:any){

        employeeCoachSessionsModel.hasOne(employeeModel,{foreignKey:"id",sourceKey:"employee_id",targetKey:"id"})
        employeeCoachSessionsModel.hasOne(coachManagementModel,{foreignKey:"id",sourceKey:"coach_id",targetKey:"id"})
        employeeCoachSessionsModel.hasOne(employeeRanksModel,{foreignKey:"id",sourceKey:"employee_rank_id",targetKey:"id"})
        employeeCoachSessionsModel.hasOne(coachSpecializationCategoriesModel,{foreignKey:"id",sourceKey:"coach_specialization_category_id",targetKey:"id"})
        employeeModel.hasOne(employersModel,{foreignKey:"id",sourceKey:"current_employer_id",targetKey:"id"})

        let session=await helperFunction.convertPromiseToObject(
            await employeeCoachSessionsModel.findOne({
                where:{
                    id:params.session_id,
                    // status:{
                    //     [Op.notIn]:[constants.STATUS.deleted]
                    // }
                },
                include:[
                    {
                        model:employeeModel,
                        attributes:['id','name'],
                        required:true,
                        include: [{
                            model: employersModel,
                            attributes: []
                        }]
                    },
                    {
                        model:coachManagementModel,
                        attributes:['id','name'],
                        required:true,
                    },
                    {
                        model:employeeRanksModel,
                        required:true,
                    },
                    {
                        model:coachSpecializationCategoriesModel,
                        required:true,
                    }
                ],
                attributes: [ "id",
                "coach_id",
                "employee_id",
                "employee_rank_id",
                "coach_specialization_category_id",
                "query",
                "coach_rating",
                "date",
                "start_time",
                "end_time",
                "slot_id",
                "call_duration",
                "comment",
                "cancelled_by",
                "cancel_reason",
                "amount",
                "type",
                "is_rating_skipped",
                "status","details","action_by",
                "action",
                "request_received_date",
                "timeline",
                "createdAt",
                "updatedAt",[Sequelize.col('employee.employer.name'), 'employer_name']]
            })
        )

        if(!session) throw new Error(constants.MESSAGES.no_session)

        return session;
    }
    

}
