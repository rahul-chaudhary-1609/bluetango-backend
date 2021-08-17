"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamGoalAssignModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.teamGoalAssignModel = connection_1.sequelize.define("team_goal_assign", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    goal_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    employee_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    complete_measure: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    last_submit_reminder_datetime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: "2021-08-01"
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "0=>assign, 1=> approve, 2=> rejected, 3=> requested"
    }
}, {
    tableName: "team_goal_assign"
});
exports.teamGoalAssignModel.sync({ alter: false });
//# sourceMappingURL=teamGoalAssign.js.map