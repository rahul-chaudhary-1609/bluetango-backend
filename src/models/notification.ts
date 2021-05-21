import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const notificationModel: any = sequelize.define("notification", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    team_goal_assign_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    team_goal_assign_completion_by_employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    reciever_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "0=> other, 1=> assign_new_goal, 2=>goal_complete_request, 3=> rating, 4=>message, 5=>audio_chat, 6=>video_chat, 7=>goal_accecpt, 8=>goal_reject, 9=>chat_disconnect, 10=> audio_chat_missed, 11=> video_chat_missed, 12=> achievement_post, 13=> achievement_like, 14=> achievement_highfive, 15=> achievement_comment, 16=> expiration_of_free_trial"    },
    data: {
        type: DataTypes.JSON,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    }
},
    {
        tableName: "notification"
    }
);
notificationModel.sync({ alter: true });
