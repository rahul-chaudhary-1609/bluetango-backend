import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const employeeCoachSessionsModel: any = sequelize.define("employee_coach_sessions", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    coach_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    employee_rank_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    coach_rating: {
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue:1,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    }
},
    {
        tableName: "employee_coach_sessions"
    }
);
employeeCoachSessionsModel.sync({ alter: true });