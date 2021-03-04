"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamGoalModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.teamGoalModel = connection_1.sequelize.define("team_goal", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    manager_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    start_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    end_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    select_measure: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        comment: "1=>Amount, 2=> Quantity",
    },
    enter_measure: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    tableName: "team_goal"
});
exports.teamGoalModel.sync({ alter: false });
//# sourceMappingURL=teamGoal.js.map