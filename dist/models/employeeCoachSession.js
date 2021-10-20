"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeCoachSessionsModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.employeeCoachSessionsModel = connection_1.sequelize.define("employee_coach_sessions", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    coach_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    employee_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    employee_rank_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    coach_specialization_category_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    query: {
        type: sequelize_1.DataTypes.TEXT,
    },
    coach_rating: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    // datetime:{
    //     type:DataTypes.DATE,
    //     allowNull:false,
    // },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    start_time: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    },
    end_time: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: true,
    },
    call_duration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "in minutes"
    },
    comment: {
        type: sequelize_1.DataTypes.TEXT,
    },
    cancelled_by: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "0=>not_cancelled, 1=> coach, 2=> employee"
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
    },
    type: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: "1=> free, 2=> paid"
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '1=>pending, 2=>accepted, 3=>rejected, 4=> cancelled, 5=>completed'
    },
    details: {
        type: sequelize_1.DataTypes.JSON,
    },
}, {
    tableName: "employee_coach_sessions"
});
exports.employeeCoachSessionsModel.sync({ alter: true });
//# sourceMappingURL=employeeCoachSession.js.map