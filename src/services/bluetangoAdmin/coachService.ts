import { adminModel } from "../../models/admin";
import { bluetangoAdminModel } from "../../models/bluetangoAdmin";
import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as tokenResponse from "../../utils/tokenResponse";
import * as helperFunction from "../../utils/helperFunction";
import * as queryService from '../../queryService/bluetangoAdmin/queryService';
import { coachManagementModel } from "../../models";
import { coachSpecializationCategoriesModel } from "../../models/coachSpecializationCategories";
import { employeeRanksModel } from "../../models/employeeRanks";
import { employeeCoachSessionsModel } from "../../models/employeeCoachSession";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class CoachService {
    constructor() { }

    public async getCoachList(params:any){
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        let where: any = {}

        if (params.searchKey && params.searchKey.trim()) {
            where={
                ...where,
                [Op.or]:[
                    {
                        name:{
                            [Op.iLike]:`%${params.searchKey}%`
                        }
                    },
                    {
                        email:{
                            [Op.iLike]:`%${params.searchKey}%`
                        }
                    },
                    {
                        phone_number:{
                            [Op.iLike]:`%${params.searchKey}%`
                        }
                    },
                ]
            }
        }

        if(params.coach_specialization_category_id){
            where["coach_specialization_category_ids"] = { 
                        [Op.contains]: [params.coach_specialization_category_id] 
                    }
        }

        if(params.employee_rank_id){
            where["employee_rank_ids"] = { 
                        [Op.contains]: [params.employee_rank_id] 
                    }
        }

        if(params.status){
            where["status"] = parseInt(params.status);
        }else{
            where["status"] = {
                [Op.in]:[constants.STATUS.active,constants.STATUS.inactive]
            }
        }

       
        let coachList= await helperFunction.convertPromiseToObject(
             await coachManagementModel.findAndCountAll({
                where: where,
                attributes: ["id", "name", "email", "phone_number","coach_specialization_category_ids","employee_rank_ids","coach_charge"],
                order: [["id", "DESC"]]
            })
        )
        let c=0
        for(let coach of coachList.rows){
            let coach_specialization_categories=//helperFunction.convertPromiseToObject(
                coachSpecializationCategoriesModel.findAll({
                    where:{
                        id:{
                            [Op.in]:coach.coach_specialization_category_ids || [],
                        },
                        status:constants.STATUS.active,
                    }
                })
           // )

            let employee_ranks=//helperFunction.convertPromiseToObject(
                employeeRanksModel.findAll({
                    where:{
                        id:{
                            [Op.in]:coach.employee_rank_ids || [],
                        },
                        status:constants.STATUS.active,
                    }
                })
            //)

            let total_completed_sessions=employeeCoachSessionsModel.count({
                where:{
                    coach_id:coach.id,
                    status:constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                }
            })

            let totalRating=employeeCoachSessionsModel.sum('coach_rating',{
                where:{
                    coach_id:coach.id,
                    status:constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    coach_rating:{
                        [Op.gte]:1
                    }
                }
            })

            let rating_count=employeeCoachSessionsModel.count({
                where:{
                    coach_id:coach.id,
                    status:constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    coach_rating:{
                        [Op.gte]:1
                    }
                }
            })

            let allPromiseResponse=await Promise.all([
                coach_specialization_categories,
                employee_ranks,
                total_completed_sessions,
                totalRating,
                rating_count
            ])

            coach.coach_specialization_categories=allPromiseResponse[0]
            coach.employee_ranks=allPromiseResponse[1]
            coach.total_completed_sessions=allPromiseResponse[2]
            totalRating=allPromiseResponse[3]
            coach.rating_count=allPromiseResponse[4]

            coach.average_rating=0;

            if(coach.rating_count>0){
                coach.average_rating=parseFloat((parseInt(totalRating)/coach.rating_count).toFixed(0));
            }            
            delete coach.coach_specialization_category_ids;
            delete coach.employee_rank_ids;
        }

        if(params.rating){
            let coachListFilteredByRating=coachList.rows.filter((coach)=>coach.average_rating==params.rating);
            coachList.rows=[...coachListFilteredByRating];
            coachList.count=coachListFilteredByRating.length;
        }

        coachList.rows=coachList.rows.slice(offset,offset+limit);  

        return coachList;
    }
    
}