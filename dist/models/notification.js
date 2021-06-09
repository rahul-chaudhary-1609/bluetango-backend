"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.notificationModel = connection_1.sequelize.define("notification", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    type_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    team_goal_assign_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    team_goal_assign_completion_by_employee_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    sender_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    reciever_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "0=> other, 1=> assign_new_goal, 2=>goal_complete_request, 3=> rating, 4=>message, 5=>audio_chat, 6=>video_chat, 7=>goal_accecpt, 8=>goal_reject, 9=>chat_disconnect, 10=> audio_chat_missed, 11=> video_chat_missed, 12=> achievement_post, 13=> achievement_like, 14=> achievement_highfive, 15=> achievement_comment, 16=> expiration_of_free_trial"
    },
    reciever_type: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: "1=> employee, 2=> employer, 3=>coach, 4=>admin"
    },
    data: {
        type: sequelize_1.DataTypes.JSON,
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    }
}, {
    tableName: "notification"
});
exports.notificationModel.sync({ alter: false });
//# sourceMappingURL=notification.js.map