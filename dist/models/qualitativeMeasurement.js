"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qualitativeMeasurementModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.qualitativeMeasurementModel = connection_1.sequelize.define("qualitattive_measurement", {
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
    employee_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    initiative: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    initiative_desc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    ability_to_delegate: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    ability_to_delegate_desc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    clear_Communication: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    clear_Communication_desc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    self_awareness_of_strengths_and_weaknesses: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    self_awareness_of_strengths_and_weaknesses_desc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    agile_thinking: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    agile_thinking_desc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    influence: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    influence_desc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    empathy: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    empathy_desc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    leadership_courage: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    leadership_courage_desc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    customer_client_patient_satisfaction: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    customer_client_patient_satisfaction_desc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    team_contributions: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    team_contributions_desc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    time_management: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    time_management_desc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    work_product: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    work_product_desc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: "qualitattive_measurement"
});
exports.qualitativeMeasurementModel.sync({ alter: false });
//# sourceMappingURL=qualitativeMeasurement.js.map