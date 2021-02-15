import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const qualitativeMeasurementModel: any = sequelize.define("qualitattive_measurement", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    manager_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    initiative: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    initiative_desc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ability_to_delegate: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    ability_to_delegate_desc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    clear_Communication: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    clear_Communication_desc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    self_awareness_of_strengths_and_weaknesses: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    self_awareness_of_strengths_and_weaknesses_desc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    agile_thinking: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    agile_thinking_desc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    influence: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    influence_desc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    empathy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    empathy_desc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    leadership_courage: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    leadership_courage_desc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    customer_client_patient_satisfaction: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    customer_client_patient_satisfaction_desc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    team_contributions: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    team_contributions_desc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    time_management: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    time_management_desc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    work_product: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    work_product_desc: {
        type: DataTypes.STRING,
        allowNull: true,
    }
},
    {
        tableName: "qualitattive_measurement"
    }
);
qualitativeMeasurementModel.sync({ alter: false });
