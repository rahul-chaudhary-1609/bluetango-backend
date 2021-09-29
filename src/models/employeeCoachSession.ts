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
    datetime:{
        type:DataTypes.DATE,
        allowNull:false,
    },
    call_duration:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0,
        comment:"in minutes"
    },
    comment:{
        type:DataTypes.TEXT,
    },
    cancelled_by:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0,
        comment:"0=>not_cancelled, 1=> coach, 2=> employee"
    },
    amount:{
        type:DataTypes.DECIMAL(15,2),
    },
    type:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:1,
        comment:"1=> free, 2=> paid"
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    },
    details:{
        type:DataTypes.JSON,
    },
},
    {
        tableName: "employee_coach_sessions"
    }
);
employeeCoachSessionsModel.sync({ alter: true });