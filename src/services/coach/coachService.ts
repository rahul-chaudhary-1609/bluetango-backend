import _ from "lodash";
import * as constants from "../../constants";
import * as helperFunction from "../../utils/helperFunction";
import { coachScheduleModel } from "../../models/coachSchedule";
const Sequelize = require('sequelize');
const moment =require("moment");
var Op = Sequelize.Op;

export class CoachService {
    constructor(){}

    public async addSlot(params:any,user:any){

        console.log("add slot params1",params);

        if(params.type==constants.COACH_SCHEDULE_TYPE.weekly && !params.day) 
            throw new Error(constants.MESSAGES.coach_schedule_day_required)

        if(params.type==constants.COACH_SCHEDULE_TYPE.custom && params.custom_dates?.length==0) 
            throw new Error(constants.MESSAGES.coach_schedule_custom_dates_required)

        let dates=[];

        switch(parseInt(params.type)){
            case constants.COACH_SCHEDULE_TYPE.does_not_repeat:
                dates.push(params.date)
                break
            
            case constants.COACH_SCHEDULE_TYPE.daily:{
                let start=new Date(params.date);
                let end=new Date(params.date);
                end.setFullYear(start.getFullYear()+1)

                while (start<end) {
                    dates.push(moment(start).format("YYYY-MM-DD"))
                    start.setDate(start.getDate()+1)
                }
                break
            }
            case constants.COACH_SCHEDULE_TYPE.every_week_day:{
                let start=new Date(params.date);
                let end=new Date(params.date);
                end.setFullYear(start.getFullYear()+1)

                while (start<end) {
                    if(![constants.COACH_SCHEDULE_DAY.saturday,constants.COACH_SCHEDULE_DAY.sunday].includes(parseInt(moment(start).format('d')))){
                        dates.push(moment(start).format("YYYY-MM-DD"))
                    }
                    start.setDate(start.getDate()+1)
                }
                break
            }
            case constants.COACH_SCHEDULE_TYPE.weekly:{
                let start=new Date(params.date);
                let end=new Date(params.date);
                end.setFullYear(start.getFullYear()+1)

                while (start<end) {
                    if(params.day==parseInt(moment(start).format('d'))){
                        dates.push(moment(start).format("YYYY-MM-DD"))
                    }
                    start.setDate(start.getDate()+1)
                }
                break
            }
            case constants.COACH_SCHEDULE_TYPE.custom:{
                let start=new Date(params.date);
                let end=new Date(params.custom_date);

                while (start<=end) {
                    dates.push(moment(start).format("YYYY-MM-DD"))
                    start.setDate(start.getDate()+1)
                }
                break
            }
            // case constants.COACH_SCHEDULE_TYPE.custom:{
            //     for(let date of params.custom_dates){
            //         dates.push(date)
            //     }
            //     break
            // }
        }

        let schedules=[];
        let slot_time_group_id=await helperFunction.getUniqueSlotTimeGroupId();

        let slots=params.slots;

        slots.forEach((slot)=>{
            Object.keys(slot).forEach((key)=>{
                slot[key]=slot[key].replace(/:/g,"")
            })
        })

        slots.forEach((slot1,index1)=>{
            if(!(slot1.start_time<slot1.end_time)){
                throw new Error(constants.MESSAGES.coach_schedule_start_greater_or_equal_end)
            }
            Object.keys(slot1).forEach((key)=>{
                slots.forEach((slot2,index2)=>{
                    if(slot1[key]>=slot2.start_time && slot1[key]<=slot2.end_time && index1!=index2){
                        throw new Error(constants.MESSAGES.coach_schedule_overlaped)
                    }
                })
            })
        })

        slots.forEach((slot)=>{
            Object.keys(slot).forEach((key)=>{
                slot[key]=moment(slot[key],"HHmmss").format("HH:mm:ss")
            })
        })

        for(let slot of params.slots){

            let schedule=await coachScheduleModel.findOne({
                where:{
                    coach_id:user.uid,
                    date:{
                        [Op.in]:dates,
                    },
                    [Op.or]:[
                        {
                            start_time:{
                                [Op.between]:[
                                    slot.start_time,
                                    slot.end_time,
                                ]
                            },
                        },
                        {
                            end_time:{
                                [Op.between]:[
                                    slot.start_time,
                                    slot.end_time,
                                ]
                            },
                        },
                    ],
                    status:{
                        [Op.notIn]:[constants.COACH_SCHEDULE_STATUS.passed]
                    }
                }
        
            })

            if(schedule) throw new Error(constants.MESSAGES.coach_schedule_already_exist)

            let slot_date_group_id=await helperFunction.getUniqueSlotDateGroupId();

            for(let date of dates){

                schedules.push({
                    slot_date_group_id,
                    slot_time_group_id,
                    coach_id:user.uid,
                    date,
                    start_time:slot.start_time,
                    end_time:slot.end_time,
                    type:params.type,
                    day:params.type==constants.COACH_SCHEDULE_TYPE.weekly? params.day : null,
                    custom_date:params.type==constants.COACH_SCHEDULE_TYPE.custom? params.custom_date :null,
                    custom_dates:null,
                })

            }

        }

        if(schedules.length<1000){
            await coachScheduleModel.bulkCreate(schedules)

            return true;
        }else{
            let size=schedules.length;
            let start=0;
            let end=999;
            
            while (size>0) {
                await coachScheduleModel.bulkCreate(schedules.slice(start,end))
                start=start+999;
                end=end+999;
                size=size-999;
            }

            return true;
        }
        
    }

    public async getSlots(params:any,user:any){

        console.log("params",params)

        let where=<any>{
            coach_id:user.uid,
            status:{
                [Op.notIn]:[constants.COACH_SCHEDULE_STATUS.passed]
            }
        }

        let start_date = new Date();
        let end_date = new Date();

        if (params.filter_key) {
            if (params.filter_key == "Daily") {
                where = {
                  ...where,
                  date:moment(new Date()).format("YYYY-MM-DD"),
                };
            } else if (params.filter_key == "Weekly") {
                start_date = helperFunction.getMonday(start_date);
                end_date = helperFunction.getMonday(start_date);
                end_date.setDate(start_date.getDate() + 6);
                where = {
                    ...where,
                    date:{
                        [Op.between]:[
                            moment(start_date).format("YYYY-MM-DD"),
                            moment(end_date).format("YYYY-MM-DD")
                        ]
                    }
                };
            } else if (params.filter_key == "Monthly") {
                start_date.setDate(1)
                end_date.setMonth(start_date.getMonth() + 1)
                end_date.setDate(1)
                end_date.setDate(end_date.getDate() - 1)
            
                where = {
                    ...where,
                    date:{
                        [Op.between]:[
                        moment(start_date).format("YYYY-MM-DD"),
                        moment(end_date).format("YYYY-MM-DD")
                        ]
                    }
                };
            } else if (params.filter_key == "Yearly") {
                start_date.setDate(1)
                start_date.setMonth(0)
                end_date.setDate(1)
                end_date.setMonth(0)
                end_date.setFullYear(end_date.getFullYear() + 1)
                end_date.setDate(end_date.getDate()-1)
                where = {
                    ...where,
                    date:{
                        [Op.between]:[
                          moment(start_date).format("YYYY-MM-DD"),
                          moment(end_date).format("YYYY-MM-DD")
                        ]
                    }
                };
            }     
        } else if((params.day && params.month && params.year) || params.date){
            where = {
                ...where,
                date:params.date || `${params.year}-${params.month}-${params.day}`,
            };
        } else if(params.week && params.year){
            where = {
                [Op.and]:[
                    {
                        ...where,
                    },
                    Sequelize.where(Sequelize.fn("date_part","year",Sequelize.col("date")),"=",params.year),
                    Sequelize.where(Sequelize.fn("date_part","week",Sequelize.col("date")),"=",params.week),
                ]
            };
        } else if(params.month && params.year){
            where = {
                [Op.and]:[
                    {
                        ...where,
                    },
                    Sequelize.where(Sequelize.fn("date_part","year",Sequelize.col("date")),"=",params.year),
                    Sequelize.where(Sequelize.fn("date_part","month",Sequelize.col("date")),"=",params.month),
                ]
            };
        } else if(params.year){
            where = {
                [Op.and]:[
                    {
                        ...where,
                    },
                    Sequelize.where(Sequelize.fn("date_part","year",Sequelize.col("date")),"=",params.year),
                ]
            };
        }else{
            start_date.setDate(1)
            end_date.setMonth(start_date.getMonth() + 1)
            end_date.setDate(1)
            end_date.setDate(end_date.getDate() - 1)
            
            where = {
                ...where,
                date:{
                    [Op.between]:[
                        moment(start_date).format("YYYY-MM-DD"),
                        moment(end_date).format("YYYY-MM-DD")
                    ]
                }
            };
        }       

        return await helperFunction.convertPromiseToObject(
            await coachScheduleModel.findAndCountAll({
                where,
                order:[["date", "ASC"],["start_time", "ASC"]]
            })
        )
    }

    public async getSlot(params:any){

        let schedule=await helperFunction.convertPromiseToObject(
            await coachScheduleModel.findByPk(parseInt(params.slot_id))
        )

        if(!schedule) throw new Error(constants.MESSAGES.no_coach_schedule)

        return schedule
    }

    public async deleteSlot(params:any){

        if(params.type==constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.individual && !params.slot_id) throw new Error(constants.MESSAGES.slot_id_required)

        if(params.type==constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.group && params.group_type==constants.COACH_SCHEDULE_SLOT_GROUP_DELETE_TYPE.date && !params.slot_date_group_id) throw new Error(constants.MESSAGES.slot_date_group_id_required)

        if(params.type==constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.group && params.group_type==constants.COACH_SCHEDULE_SLOT_GROUP_DELETE_TYPE.time && !params.slot_time_group_id) throw new Error(constants.MESSAGES.slot_time_group_id_required)

        if(params.type==constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.individual){
            let schedule=await coachScheduleModel.findByPk(parseInt(params.slot_id));

            if(!schedule) throw new Error(constants.MESSAGES.no_coach_schedule)

            schedule.destroy();
            

        } else if(params.type==constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.group && params.slot_date_group_id) {
            let schedules = await coachScheduleModel.findAll({
                where:{
                    slot_date_group_id:params.slot_date_group_id
                }
            });

            if(schedules.length==0) throw new Error(constants.MESSAGES.no_coach_schedule)

            await coachScheduleModel.destroy({
                where:{
                    slot_date_group_id:params.slot_date_group_id
                }
            });

        }else if(params.type==constants.COACH_SCHEDULE_SLOT_DELETE_TYPE.group && params.slot_time_group_id) {
            let schedules = await coachScheduleModel.findAll({
                where:{
                    slot_time_group_id:params.slot_time_group_id
                }
            });

            if(schedules.length==0) throw new Error(constants.MESSAGES.no_coach_schedule)

            await coachScheduleModel.destroy({
                where:{
                    slot_time_group_id:params.slot_time_group_id
                }
            });
        }       

        return true;
    }
}