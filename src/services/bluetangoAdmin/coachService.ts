import { adminModel } from "../../models/admin";
import { bluetangoAdminModel } from "../../models/bluetangoAdmin";
import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as tokenResponse from "../../utils/tokenResponse";
import * as helperFunction from "../../utils/helperFunction";
import * as queryService from '../../queryService/bluetangoAdmin/queryService';
import { coachManagementModel,coachBiosModel, } from "../../models";
import { coachSpecializationCategoriesModel } from "../../models/coachSpecializationCategories";
import { employeeRanksModel } from "../../models/employeeRanks";
import { employeeCoachSessionsModel } from "../../models/employeeCoachSession";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class CoachService {
    constructor() { }

    public async dashboard(params:any) {

        
        let where=<any>{
            [Op.and]:[
                {
                    status:constants.STATUS.active,
                },
                Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '>=', params.from),
                Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '<=', params.to),
                
            ]
        }

        let coachCount=await queryService.count(coachManagementModel,{where})

        where={
            [Op.and]:[
                {
                    status:constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                },
                Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '>=', params.from),
                Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '<=', params.to),
                
            ]
            
        }


        where={
            ...where,
            type:constants.EMPLOYEE_COACH_SESSION_TYPE.free,            
        }

        let totalFreeSessions=await queryService.count(employeeCoachSessionsModel,{where});

        where={
            ...where,
            type:constants.EMPLOYEE_COACH_SESSION_TYPE.paid,            
        }

        let totalPaidSessions=await queryService.count(employeeCoachSessionsModel,{where});

        where={
            [Op.and]:[
                {
                    status:{
                        [Op.notIn]:[
                            constants.EMPLOYEE_COACH_SESSION_STATUS.cancelled,
                            constants.EMPLOYEE_COACH_SESSION_STATUS.rejected
                        ]
                    }
                },
                Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '>=', params.from),
                Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '<=', params.to),
                
            ]
            
        }

        employeeCoachSessionsModel.hasOne(coachManagementModel,{foreignKey:"id",sourceKey:"coach_id",targetKey:"id"})

        let conditions:any={
                    attributes:[
                        'coach_id',
                        [Sequelize.fn('COUNT', Sequelize.col('id')), 'sessionCount'],
                        [Sequelize.fn('SUM', Sequelize.col('call_duration')), 'totalDuration'],
                    ],
                    where,
                    group:['"employee_coach_sessions.coach_id"'],
                    order: [[Sequelize.fn('COUNT', Sequelize.col('id')), "DESC"]],
        }

        let topFiveSessionTaker=await helperFunction.convertPromiseToObject(await queryService.selectAll(employeeCoachSessionsModel,conditions))

        for(let coach of topFiveSessionTaker){
            let conditions:any={
                    attributes:["id","name","email"],
                    where:{
                        id:coach.coach_id,
                    }
            }

            coach.coach=await helperFunction.convertPromiseToObject(await queryService.selectOne(coachManagementModel,conditions));
            
            conditions={
                attributes:["createdAt"],
                    where:{
                        coach_id:coach.coach_id,
                        // status:constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    },
                    order: [["createdAt", "DESC"]],
            }
            coach.conversionRate=1;
            coach.since=await helperFunction.convertPromiseToObject(await queryService.selectOne(employeeCoachSessionsModel,conditions));
            coach.since=coach.since?.createdAt;
        }

        let topCoaches=[];

        // console.log("topFiveSessionTaker",topFiveSessionTaker)

        if(params.searchKey && params.searchKey.trim()){
            topCoaches=topFiveSessionTaker.filter(coach=>coach.coach?.name.toLowerCase().includes(params.searchKey.toLowerCase())).slice(0,5);
        }else{
            topCoaches=topFiveSessionTaker.slice(0,5);
        }

        // console.log("topCoaches",topCoaches)

        return {
            totalCoach:coachCount,
            avgFreeSession:coachCount?totalFreeSessions/coachCount:0,
            avgPaidSession:coachCount?totalPaidSessions/coachCount:0,
            totalFreeSessions,
            totalPaidSessions,
            avgConversionRate:1,
            topCoaches
         }

    }


    public async getCoachList(params:any){
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        let where: any = {
            app_id:constants.COACH_APP_ID.BT,
        }

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

        let query:any={
            where: where,
            attributes: ["id", "name", "email", "phone_number","coach_specialization_category_ids","employee_rank_ids","coach_charge","status","app_id","social_media_handles","website","document_url"],
            order: [["id", "DESC"]],
        }

       
        let coachList= await helperFunction.convertPromiseToObject(
             await queryService.selectAndCountAll(coachManagementModel,query)
        )
        let c=0
        for(let coach of coachList.rows){
            let query:any={
                where:{
                    id:{
                        [Op.in]:coach.coach_specialization_category_ids || [],
                    },
                    status:constants.STATUS.active,
                }
            }

            coach.coach_specialization_categories=await helperFunction.convertPromiseToObject(
                await queryService.selectAll(coachSpecializationCategoriesModel,query)
            )

            query={
                where:{
                    id:{
                        [Op.in]:coach.employee_rank_ids || [],
                    },
                    status:constants.STATUS.active,
                }
            }

            coach.employee_ranks=await helperFunction.convertPromiseToObject(
                await queryService.selectAll(employeeRanksModel,query)
            )

            query={
                where:{
                    coach_id:coach.id,
                    status:constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                }
            }

            coach.total_completed_sessions=await queryService.count(employeeCoachSessionsModel,query);

            query={
                where:{
                    coach_id:coach.id,
                    status:constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    coach_rating:{
                        [Op.gte]:1
                    }
                }
            }

            let totalRating=await queryService.sum(employeeCoachSessionsModel,'coach_rating',query);

            query={
                where:{
                    coach_id:coach.id,
                    status:constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    coach_rating:{
                        [Op.gte]:1
                    }
                }
            }

            coach.rating_count=await queryService.count(employeeCoachSessionsModel,query);

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
    
    public async addCoach(params: any, user: any) {
        params.email=params.email.toLowerCase();

        let query:any={
            where:{
                [Op.or]:[
                    {
                        email:params.email,
                    },
                    {
                        phone_number:params.phone_number
                    },
                ],
                status:{
                    [Op.in]:[constants.STATUS.active,constants.STATUS.inactive]
                },
                app_id:constants.COACH_APP_ID.BT,
            }
        }

        let coach:any=await queryService.selectOne(coachManagementModel,query);

        if(!coach){
                let password = helperFunction.generaePassword();
                params.app_id=constants.COACH_APP_ID.BT;
                params.admin_id=user.uid,
                params.password = await appUtils.bcryptPassword(password);
                let newCoach=await queryService.addData(coachManagementModel,params);
                newCoach = newCoach.get({plain:true});

                delete newCoach.password;

                const mailParams = <any>{};
                mailParams.to = params.email;
                mailParams.html = `Hi  ${params.name}
                <br> Please download the app by clicking on link below and use the given credentials for login into the app :
                <br><br><b> Android URL</b>: ${process.env.COACH_ANDROID_URL}
                <br><b> IOS URL</b>: ${process.env.COACH_IOS_URL} <br>
                <br> username : ${params.email}
                <br> password : ${password}
                <br> Check your details here:
                <br><table style="padding:0px 10px 10px 10px;">
                `;

                delete newCoach.password;
                let query:any={
                    where:{
                        id:{
                            [Op.in]:newCoach.coach_specialization_category_ids || [],
                        },
                        status:constants.STATUS.active,
                    },
                    attributes:['name']
                }

                newCoach.coach_specialization_categories=await helperFunction.convertPromiseToObject(
                    await queryService.selectAll(coachSpecializationCategoriesModel,query)
                )

                newCoach.coach_specialization_categories=newCoach.coach_specialization_categories.map(category=>category.name).join(', ');

                delete newCoach.coach_specialization_category_ids;

                query={
                    where:{
                        id:{
                            [Op.in]:newCoach.employee_rank_ids || [],
                        },
                        status:constants.STATUS.active,
                    },
                    attributes:['name']
                }
                newCoach.employee_ranks=await helperFunction.convertPromiseToObject(
                    await queryService.selectAll(employeeRanksModel,query)
                )

                newCoach.employee_ranks=newCoach.employee_ranks.map(rank=>rank.name).join(', ');

                newCoach.fees_per_session=newCoach.coach_charge;

                // delete newCoach.id;
                // delete newCoach.admin_id;
                // delete newCoach.device_token;
                delete newCoach.first_time_login;
                delete newCoach.first_time_login_datetime;
                delete newCoach.first_time_reset_password;
                delete newCoach.fileName;
                delete newCoach.status;
                delete newCoach.coach_charge;
                delete newCoach.employee_rank_ids
                delete newCoach.updatedAt
                delete newCoach.createdAt


                for (let key in newCoach) {
        
                    mailParams.html+= `<tr style="text-align: left;">
                            <th style="opacity: 0.9;">${key.split("_").map((ele) => {
                                if (ele == "of" || ele == "in") return ele
                                else return ele.charAt(0).toUpperCase() + ele.slice(1)
                            }).join(" ")}</th>
                            <td style="opacity: 0.8;">:</td>
                            <td style="opacity: 0.8;">${key=='image'?`<img src='${newCoach[key]}' />`:newCoach[key]}</td>
                        </tr>`
                }
                mailParams.html+=`</table>`;

                mailParams.subject = "Coach Login Credentials";
                mailParams.name="BlueTango"
                await helperFunction.sendEmail(mailParams);
                return newCoach;
        }else{
            throw new Error(constants.MESSAGES.email_phone_already_registered)
        }
    }

    public async editCoach(params: any) {
        params.email=params.email.toLowerCase();

        let query:any={
            where:{
                [Op.or]:[
                    {
                        email:params.email,
                    },
                    {
                        phone_number:params.phone_number
                    },
                ],
                status:{
                    [Op.in]:[constants.STATUS.active,constants.STATUS.inactive]
                },
                app_id:constants.COACH_APP_ID.BT,
                id:{
                    [Op.ne]:params.coach_id,
                }
            }
        }

        let coach:any=await queryService.selectOne(coachManagementModel,query);

        if(!coach){

            params.model=coachManagementModel;                
            let query:any={
                where:{
                    id:params.coach_id,
                    app_id:constants.COACH_APP_ID.BT,
                },
                raw:true,
            }
            let updatedCoach=await queryService.updateData(params,query);
            return updatedCoach;
        }else{
            throw new Error(constants.MESSAGES.email_phone_already_registered)
        }
    }

    public async getCoachDetails(params: any) {

        let query:any={
            where :{
                id: params.coach_id,
                status: [0,1]
            },
            attributes: ["id", "name", "email", "phone_number", "country_code", "description", "image", "fileName","coach_specialization_category_ids","employee_rank_ids","coach_charge","status","app_id","social_media_handles","website","document_url"],
        }
        const coach = await helperFunction.convertPromiseToObject(
                await queryService.selectOne(coachManagementModel,query)
        )
        
        if (coach) {

            let query:any={
                where:{
                    id:{
                        [Op.in]:coach.coach_specialization_category_ids || [],
                    },
                    status:constants.STATUS.active,
                }
            }

            coach.coach_specialization_categories=await helperFunction.convertPromiseToObject(
                await queryService.selectAll(coachSpecializationCategoriesModel,query)
            )

            query={
                where:{
                    id:{
                        [Op.in]:coach.employee_rank_ids || [],
                    },
                    status:constants.STATUS.active,
                }
            }

            coach.employee_ranks=await helperFunction.convertPromiseToObject(
                await queryService.selectAll(employeeRanksModel,query)
            )

            query={
                where:{
                    coach_id:coach.id,
                    status:constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                }
            }

            coach.total_completed_sessions=await queryService.count(employeeCoachSessionsModel,query);

            query={
                where:{
                    coach_id:coach.id,
                    status:constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    coach_rating:{
                        [Op.gte]:1
                    }
                }
            }

            let totalRating=await queryService.sum(employeeCoachSessionsModel,'coach_rating',query);

            query={
                where:{
                    coach_id:coach.id,
                    status:constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                    coach_rating:{
                        [Op.gte]:1
                    }
                }
            }

            coach.rating_count=await queryService.count(employeeCoachSessionsModel,query);

            coach.average_rating=0;

            if(coach.rating_count>0){
                coach.average_rating=parseFloat((parseInt(totalRating)/coach.rating_count).toFixed(0));
            }            
            delete coach.coach_specialization_category_ids;
            delete coach.employee_rank_ids;
    
            let where:any={
                status:constants.EMPLOYEE_COACH_SESSION_STATUS.completed,
                coach_id:coach.id,
                type:constants.EMPLOYEE_COACH_SESSION_TYPE.free,            
            }
    
            coach.freeSessionsCount=await queryService.count(employeeCoachSessionsModel,{where});
            coach.freeSessionsMinutes=await queryService.sum(employeeCoachSessionsModel,'call_duration',{where}) || 0;
    
            where={
                ...where,
                type:constants.EMPLOYEE_COACH_SESSION_TYPE.paid,            
            }
    
            coach.paidSessionsCount=await queryService.count(employeeCoachSessionsModel,{where});
            coach.paidSessionsMinutes=await queryService.sum(employeeCoachSessionsModel,'call_duration',{where}) || 0;
    
            coach.conversionRate=1;

            return coach
        }
        else {
            throw new Error(constants.MESSAGES.coach_not_found)
        }

    }


    public async deleteCoach(params: any) {
        let query:any={
            where : {
                id: params.coach_id
            }
        }

        const coach = await queryService.deleteData(coachManagementModel,query);

        query={
            where : {
                coach_id: params.coach_id
            }
        }

        await queryService.deleteData(coachBiosModel,query);

        return coach;

    }

    public async blockUnblockCoach(params: any) {
        let query:any={
            where : {
                id: params.coach_id
            }
        }
        
        params.model=coachManagementModel;

        const coach = await queryService.updateData(params,query);

        return coach;

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


}