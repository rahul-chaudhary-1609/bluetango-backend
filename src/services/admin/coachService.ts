import { employersModel, industryTypeModel, employeeModel, departmentModel, adminModel } from "../../models";
import { coachManagementModel } from "../../models/coachManagement";
import { coachSpecializationCategoriesModel } from "../../models/coachSpecializationCategories";
import { employeeRanksModel } from "../../models/employeeRanks";
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

        let query=<any>{}
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

        let query=<any>{};
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
            }
        })

        if(employeeCount>0){
            throw new Error(constants.MESSAGES.employee_rank_delete_employee_error)
        }else{
            let coachCount=await coachManagementModel.count({
                where:{
                    employee_rank_ids:{
                        [Op.contains]:[rank.id]
                    }
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

    

}
