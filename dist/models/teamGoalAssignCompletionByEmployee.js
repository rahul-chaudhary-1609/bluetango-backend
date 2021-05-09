"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamGoalAssignCompletionByEmployeeModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.teamGoalAssignCompletionByEmployeeModel = connection_1.sequelize.define("team_goal_assign_completion_by_employee", {
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
    team_goal_assign_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
    },
    complete_measure: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    total_complete_measure: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "1=> approved, 2=> rejected, 3=> requested"
    }
}, {
    tableName: "team_goal_assign_completion_by_employee"
});
exports.teamGoalAssignCompletionByEmployeeModel.sync({ alter: true });
//# sourceMappingURL=teamGoalAssignCompletionByEmployee.js.map