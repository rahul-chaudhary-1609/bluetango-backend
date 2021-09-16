import { employersModel, industryTypeModel, employeeModel, departmentModel, adminModel } from "../../models";
import { coachManagementModel } from "../../models/coachManagement";
import { coachSpecializationCategoriesModel } from "../../models/coachSpecializationCategories";
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

    

}
