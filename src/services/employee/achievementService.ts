import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as helperFunction from "../../utils/helperFunction";
import { achievementModel } from "../../models/achievement";
import { achievementLikeModel } from "../../models/achievementLike";
import { achievementCommentModel } from "../../models/achievementComment";
import { achievementHighFiveModel } from "../../models/achievementHighFive";
import { employeeModel } from "../../models/employee";
import { notificationModel } from "../../models/notification";

const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class AchievementServices {
    constructor() { }

    /*
    * function to get achievemnets
    */
    public async getAchievements(user: any) {

        let employee = await helperFunction.convertPromiseToObject(await employeeModel.findByPk(parseInt(user.uid)));

        achievementModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" })

        let achievements = await helperFunction.convertPromiseToObject(
            await achievementModel.findAll({
                attributes: [
                    'id', 'employee_id', 'description', 'status',
                    ['like_count', 'likeCount'],
                    ['high_five_count', 'highFiveCount'],
                    ['comment_count', 'commentCount'],
                    'last_action_on', 'createdAt', 'updatedAt',
                ],
                include: [
                    {
                        model: employeeModel,
                        attributes: ['id', 'name', 'profile_pic_url', 'current_employer_id','status','createdAt', 'updatedAt'],
                        where: { current_employer_id: employee.current_employer_id},
                        required:true
                    },
                ],               
                order: [["last_action_on", "DESC"]]
            })
        )

        for (let achievement of achievements) {

            achievement.isLiked = false;
            achievement.isHighFived = false;
            achievement.isSelf = false;

            let achievementLike = await achievementLikeModel.findOne({
                where: {
                    liked_by_employee_id: user.uid,
                    achievement_id: parseInt(achievement.id),
                }
            })

            let achievementHighFive = await achievementHighFiveModel.findOne({
                where: {
                    high_fived_by_employee_id: user.uid,
                    achievement_id: parseInt(achievement.id),
                }
            })

            if (achievementLike) achievement.isLiked = true;
            if (achievementHighFive) achievement.isHighFived = true;
            if (achievement.employee && achievement.employee.id == parseInt(user.uid)) achievement.isSelf = true;

        }

        
        
        return {achievements}
       
    }

    /*
    * function to get achievemnet by id
    */
    public async getAchievementById(params:any,user: any) {

        achievementModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "employee_id", targetKey: "id" })
        achievementCommentModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "commented_by_employee_id", targetKey: "id" })

        let achievement = await helperFunction.convertPromiseToObject(
            await achievementModel.findOne({
                attributes: [
                    'id', 'employee_id', 'description', 'status',
                    ['like_count', 'likeCount'],
                    ['high_five_count', 'highFiveCount'],
                    ['comment_count', 'commentCount'],
                    'last_action_on', 'createdAt', 'updatedAt',
                ],
                where: {
                    id:parseInt(params.achievement_id),
                },
                include: [
                    {
                        model: employeeModel,
                        attributes: ['id', 'name', 'profile_pic_url', 'current_employer_id', 'status','createdAt', 'updatedAt'],
                        required: true
                    },
                ],
                order: [["last_action_on", "DESC"]]
            })
        )

        if (!achievement) throw new Error(constants.MESSAGES.no_achievement);


        achievement.isLiked = false;
        achievement.isHighFived = false;
        achievement.isSelf = false;


        let achievementLike = await achievementLikeModel.findOne({
            where: {
                liked_by_employee_id: user.uid,
                achievement_id: parseInt(achievement.id),
            }
        })

        let achievementHighFive = await achievementHighFiveModel.findOne({
            where: {
                high_fived_by_employee_id: user.uid,
                achievement_id: parseInt(achievement.id),
            }
        })

        if (achievementLike) achievement.isLiked = true;
        if (achievementHighFive) achievement.isHighFived = true;
        if (achievement.employee && achievement.employee.id == parseInt(user.uid)) achievement.isSelf = true;

        let achievementComments = await helperFunction.convertPromiseToObject(
            await achievementCommentModel.findAll({
                where: {
                    achievement_id: parseInt(params.achievement_id)
                },
                include: [
                    {
                        model: employeeModel,
                        attributes: ['id', 'name', 'status', 'profile_pic_url'],
                        required: false
                    }
                ],
                order: [["createdAt", "DESC"]]
            })
        )

        for (let comment of achievementComments) {
            comment.isSelf = false
            if (comment.employee && comment.employee.id == parseInt(user.uid)) comment.isSelf = true;
        }

        achievement.achievement_comments = achievementComments;


        return { achievement }

    }

    /*
    * function to create achievement
    */
    public async createUpdateAchievement(params:any,user: any) {

        let achievement = <any>{};

        if (params.achievement_id) {
            achievement = await achievementModel.findOne({
                where: {
                    employee_id: user.uid,
                    id: parseInt(params.achievement_id)
                }
            })

            if (achievement) {
                achievement.description = params.description;
                await achievement.save();
            }
            else
                throw new Error(constants.MESSAGES.no_achievement);
        }
        else {
            let achievementObj = <any>{
                employee_id: user.uid,
                description: params.description,
                last_action_on:new Date(),
            }

            achievement = await helperFunction.convertPromiseToObject( await achievementModel.create(achievementObj));

            let senderData = await helperFunction.convertPromiseToObject(await employeeModel.findByPk(parseInt(user.uid)));
            let recieversData = await helperFunction.convertPromiseToObject(
                await employeeModel.findAll({
                    where: {
                        current_employer_id: senderData.current_employer_id,
                        status:constants.STATUS.active
                    }
                })
            )
            
            delete senderData.password

            for (let recieverData of recieversData) {
                delete recieverData.password

                if (recieverData.id != senderData.id) {
                
                    // add notification for employee
                    let notificationObj = <any>{
                        type_id: parseInt(achievement.id),
                        sender_id: senderData.id,
                        reciever_id: recieverData.id,
                        type: constants.NOTIFICATION_TYPE.achievement_post,
                        data: {
                            type: constants.NOTIFICATION_TYPE.achievement_post,
                            title: `New post from ${senderData.name}`,
                            message: achievement.description.length > 50 ? `${achievement.description.slice(0, 50)}...` : achievement.description,
                            id: parseInt(achievement.id),
                            senderEmplyeeData: senderData,
                        },
                    }
                    await notificationModel.create(notificationObj);
                    // send push notification
                    let notificationData = <any>{
                        title: `New post from ${senderData.name}`,
                        body: achievement.description.length > 50 ? `${achievement.description.slice(0, 50)}...` : achievement.description,
                        data: {
                            type: constants.NOTIFICATION_TYPE.achievement_post,
                            title: `New post from ${senderData.name}`,
                            message: achievement.description.length > 50 ? `${achievement.description.slice(0, 50)}...` : achievement.description,
                            id: parseInt(achievement.id),
                            senderEmplyeeData: senderData,
                        },
                    }
                    await helperFunction.sendFcmNotification([recieverData.device_token], notificationData);
                }
            }
        }


        return achievement;

    }

    /*
    * function to like dislike an achievement
    */
    public async likeDislikeAchievement(params: any, user: any) {

        let achievement = await achievementModel.findByPk(parseInt(params.achievement_id));

        if (achievement) {

            let employee = await helperFunction.convertPromiseToObject(
                await employeeModel.findOne({
                    attributes: ['id', 'name', 'profile_pic_url', 'current_employer_id', 'status', 'createdAt', 'updatedAt'],
                    where: {
                        id: parseInt(achievement.employee_id),
                    }
                })
            )

            let achievementLike = await achievementLikeModel.findOne({
                where: {
                    liked_by_employee_id: user.uid,
                    achievement_id: parseInt(params.achievement_id)
                }
            })

            if (achievementLike) {
                await achievementLike.destroy();
                achievement.like_count = parseInt(achievement.like_count) - 1
                achievement.save();
            }
            else {

                let achievementLikeObj = <any>{
                    liked_by_employee_id: user.uid,
                    achievement_id: parseInt(params.achievement_id)
                }
                await achievementLikeModel.create(achievementLikeObj)
                
                //achievement.last_action_on = new Date();
                achievement.like_count = parseInt(achievement.like_count)+1
                achievement.save();

                let senderData = await helperFunction.convertPromiseToObject(await employeeModel.findByPk(parseInt(user.uid)));
                let recieverData = await helperFunction.convertPromiseToObject(await employeeModel.findByPk(parseInt(achievement.employee_id)));

                delete recieverData.password
                delete senderData.password

                if (recieverData.id != senderData.id) {
                    // add notification for employee
                    let notificationObj = <any>{
                        type_id: parseInt(params.achievement_id),
                        sender_id: senderData.id,
                        reciever_id: recieverData.id,
                        type: constants.NOTIFICATION_TYPE.achievement_like,
                        data: {
                            type: constants.NOTIFICATION_TYPE.achievement_like,
                            title: `${senderData.name} has liked your post`,
                            message: achievement.description.length > 50 ? `${achievement.description.slice(0, 50)}...` : achievement.description,
                            id: parseInt(params.achievement_id),
                            senderEmplyeeData: senderData,
                        },
                    }
                    await notificationModel.create(notificationObj);
                    // send push notification
                    let notificationData = <any>{
                        title: `${senderData.name} has liked your post`,
                        body: achievement.description.length > 50 ? `${achievement.description.slice(0, 50)}...` : achievement.description,
                        data: {
                            type: constants.NOTIFICATION_TYPE.achievement_like,
                            title: `${senderData.name} has liked your post`,
                            message: achievement.description.length > 50 ? `${achievement.description.slice(0, 50)}...` : achievement.description,
                            id: parseInt(params.achievement_id),
                            senderEmplyeeData: senderData,
                        },
                    }
                    await helperFunction.sendFcmNotification([recieverData.device_token], notificationData);
                }
            }

            achievement = await helperFunction.convertPromiseToObject(achievement);
            achievement.employee = employee;
            return achievement;
        }
        else {
            throw new Error(constants.MESSAGES.no_achievement);
        }               

    }

    /*
    * function to high five an achievement
    */
    public async highFiveAchievement(params: any, user: any) {

        let achievement = await achievementModel.findByPk(parseInt(params.achievement_id));

        if (achievement) {

            let employee = await helperFunction.convertPromiseToObject(
                await employeeModel.findOne({
                    attributes: ['id', 'name', 'profile_pic_url', 'current_employer_id', 'status', 'createdAt', 'updatedAt'],
                    where: {
                        id: parseInt(achievement.employee_id),
                    }
                })
            )


            let achievementhighFive = await achievementHighFiveModel.findOne({
                where: {
                    high_fived_by_employee_id: user.uid,
                    achievement_id: parseInt(params.achievement_id)
                }
            })

            if (achievementhighFive) {
                await achievementhighFive.destroy()
                achievement.high_five_count = parseInt(achievement.high_five_count) - 1
                achievement.save();
            }
            else {

                let achievementHighFiveObj = <any>{
                    high_fived_by_employee_id: user.uid,
                    achievement_id: parseInt(params.achievement_id)
                }

                await achievementHighFiveModel.create(achievementHighFiveObj)
                //achievement.last_action_on = new Date();
                achievement.high_five_count = parseInt(achievement.high_five_count) + 1
                achievement.save();

                let senderData = await helperFunction.convertPromiseToObject(await employeeModel.findByPk(parseInt(user.uid)));
                let recieverData = await helperFunction.convertPromiseToObject( await employeeModel.findByPk(parseInt(achievement.employee_id)));

                delete recieverData.password
                delete senderData.password

                if (recieverData.id != senderData.id) {

                    // add notification for employee
                    let notificationObj = <any>{
                        type_id: parseInt(params.achievement_id),
                        sender_id: senderData.id,
                        reciever_id: recieverData.id,
                        type: constants.NOTIFICATION_TYPE.achievement_highfive,
                        data: {
                            type: constants.NOTIFICATION_TYPE.achievement_highfive,
                            title: `${senderData.name} has reacted on your post`,
                            message: achievement.description.length > 50 ? `${achievement.description.slice(0, 50)}...` : achievement.description,
                            id: parseInt(params.achievement_id),
                            senderEmplyeeData: senderData,
                        },
                    }
                    await notificationModel.create(notificationObj);
                    // send push notification
                    let notificationData = <any>{
                        title: `${senderData.name} has reacted on your post`,
                        body: achievement.description.length > 50 ? `${achievement.description.slice(0, 50)}...` : achievement.description,
                        data: {
                            type: constants.NOTIFICATION_TYPE.achievement_highfive,
                            title: `${senderData.name} has reacted on your post`,
                            message: achievement.description.length > 50 ? `${achievement.description.slice(0, 50)}...` : achievement.description,
                            id: parseInt(params.achievement_id),
                            senderEmplyeeData: senderData,
                        },
                    }
                    await helperFunction.sendFcmNotification([recieverData.device_token], notificationData);
                }
            }

            achievement = await helperFunction.convertPromiseToObject(achievement);
            achievement.employee = employee;
            return achievement;
        }
        else {
            throw new Error(constants.MESSAGES.no_achievement);
        }

    }

    /*
    * function to add edit comment on achievement
    */
    public async addEditCommentAchievement(params: any, user: any) {

        let achievement = await achievementModel.findByPk(parseInt(params.achievement_id));

        if (achievement) {
            let achievementComment = <any>{};

            if (params.achievement_comment_id) {
                achievementComment = await achievementCommentModel.findOne({
                    where: {
                        commented_by_employee_id: user.uid,
                        id: parseInt(params.achievement_comment_id)
                    }
                })

                if (achievementComment) {
                    achievementComment.comment = params.comment;
                    await achievementComment.save();
                }
                else
                    throw new Error(constants.MESSAGES.no_achievement_comment);
            }
            else {
                let achievementCommentObj = <any>{
                    commented_by_employee_id: user.uid,
                    achievement_id: parseInt(params.achievement_id),
                    comment: params.comment
                }

                achievementComment = await achievementCommentModel.create(achievementCommentObj);
                achievement.last_action_on = new Date();
                achievement.comment_count = parseInt(achievement.comment_count) + 1
                achievement.save();

                let senderData = await helperFunction.convertPromiseToObject(await employeeModel.findByPk(parseInt(user.uid)));
                let recieverData = await helperFunction.convertPromiseToObject(await employeeModel.findByPk(parseInt(achievement.employee_id)));

                delete recieverData.password
                delete senderData.password


                if (recieverData.id != senderData.id) {

                    // add notification for employee
                    let notificationObj = <any>{
                        type_id: parseInt(params.achievement_id),
                        sender_id: senderData.id,
                        reciever_id: recieverData.id,
                        type: constants.NOTIFICATION_TYPE.achievement_comment,
                        data: {
                            type: constants.NOTIFICATION_TYPE.achievement_comment,
                            title: `${senderData.name} has commented on your post`,
                            message: achievement.description.length > 50 ? `${achievement.description.slice(0, 50)}...` : achievement.description,
                            id: parseInt(params.achievement_id),
                            senderEmplyeeData: senderData,
                        },
                    }
                    await notificationModel.create(notificationObj);
                    // send push notification
                    let notificationData = <any>{
                        title: `${senderData.name} has commented on your post`,
                        body: achievement.description.length > 50 ? `${achievement.description.slice(0, 50)}...` : achievement.description,
                        data: {
                            type: constants.NOTIFICATION_TYPE.achievement_comment,
                            title: `${senderData.name} has commented on your post`,
                            message: achievement.description.length > 50 ? `${achievement.description.slice(0, 50)}...` : achievement.description,
                            id: parseInt(params.achievement_id),
                            senderEmplyeeData: senderData,
                        },
                    }
                    await helperFunction.sendFcmNotification([recieverData.device_token], notificationData);
                }
            }


            return await helperFunction.convertPromiseToObject(achievementComment);
        }
        else {
            throw new Error(constants.MESSAGES.no_achievement);
        }       

    }


    /*
    * function to get comments on achievement
    */
    public async getAchievementComments(params: any, user: any) {

        achievementCommentModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "commented_by_employee_id", targetKey: "id" })

        let achievementComments = await helperFunction.convertPromiseToObject(
            await achievementCommentModel.findAll({
                where: {
                    achievement_id:parseInt(params.achievement_id)
                },
                include: [
                    {
                        model: employeeModel,
                        attributes: ['id', 'name', 'status', 'profile_pic_url'],
                        required:false
                    }
                ],
                order: [["createdAt", "DESC"]]
            })
        )

        for (let comment of achievementComments) {
            comment.isSelf = false
            if (comment.employee && comment.employee.id == parseInt(user.uid)) comment.isSelf = true;
        }

        return achievementComments;
    }

    /*
    * function to delete an achievement
    */
    public async deleteAchievement(params: any, user: any) {
            let achievement = await achievementModel.findOne({
                where: {
                    employee_id: user.uid,
                    id: parseInt(params.achievement_id)
                }
            })

            if (achievement) {
                await achievement.destroy();
                return true
            }
            else
                throw new Error(constants.MESSAGES.no_achievement);
        
    }

    /*
    * function to delete an achievement comment
    */ 
    public async deleteAchievementComment(params: any, user: any) {
        let achievementComment = await achievementCommentModel.findOne({
            where: {
                commented_by_employee_id: user.uid,
                id: parseInt(params.achievement_comment_id)
            }
        })

        if (achievementComment) {
            await achievementComment.destroy();
            let achievement = await achievementModel.findByPk(parseInt(achievementComment.achievement_id));
            achievement.comment_count = parseInt(achievement.comment_count) - 1
            achievement.save();
            return true
        }
        else
            throw new Error(constants.MESSAGES.no_achievement_comment);

    }


    /*
    * function to get list of likes on achievement
    */
    public async getAchievementLikesList(params: any, user: any) {

        achievementLikeModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "liked_by_employee_id", targetKey: "id" })

        let achievement = await helperFunction.convertPromiseToObject(await achievementModel.findByPk(parseInt(params.achievement_id)));

        let achievementLikes = await helperFunction.convertPromiseToObject(
            await achievementLikeModel.findAll({
                where: {
                    achievement_id: parseInt(params.achievement_id)
                },
                include: [
                    {
                        model: employeeModel,
                        attributes: ['id', 'name', 'status', 'profile_pic_url'],
                        required: false
                    }
                ],
                order: [["createdAt", "DESC"]]
            })
        )

        for (let like of achievementLikes) {
            like.isSelf = false
            if (like.employee && like.employee.id == parseInt(user.uid)) {
                like.isSelf = true;
                break;
            } 
        }

        // achievementLikes.likeCount = achievement.like_count;
        // achievementLikes.highFiveCount = achievement.high_five_count;

        return {
            achievementLikes,
            likeCount: achievement.like_count,
            highFiveCount: achievement.high_five_count,
        }
    }

    /*
    * function to get list of high fives on achievement
    */
    public async getAchievementHighFivesList(params: any, user: any) {

        achievementHighFiveModel.hasOne(employeeModel, { foreignKey: "id", sourceKey: "high_fived_by_employee_id", targetKey: "id" })

        let achievement = await helperFunction.convertPromiseToObject(await achievementModel.findByPk(parseInt(params.achievement_id)));

        let achievementHighFives = await helperFunction.convertPromiseToObject(
            await achievementHighFiveModel.findAll({
                where: {
                    achievement_id: parseInt(params.achievement_id)
                },
                include: [
                    {
                        model: employeeModel,
                        attributes: ['id', 'name', 'status', 'profile_pic_url'],
                        required: false
                    }
                ],
                order: [["createdAt", "DESC"]]
            })
        )

        for (let highFive of achievementHighFives) {
            highFive.isSelf = false
            if (highFive.employee && highFive.employee.id == parseInt(user.uid)) {
                highFive.isSelf = true;
                break;
            } 
        }


        // achievementHighFives.likeCount = achievement.like_count;
        // achievementHighFives.highFiveCount = achievement.high_five_count;

        return {
            achievementHighFives,
            likeCount: achievement.like_count,
            highFiveCount: achievement.high_five_count,
        };
    }


}