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
        type: sequelize_1.DataTypes.INTEGER,
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
        comment: "0=> other, 1=> assign new goal, 2=>goal complete, 3=> rating, 4=>message, 5=>audio chat, 6=>video chat, 7=>goal accecpt, 8=>goal reject"
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