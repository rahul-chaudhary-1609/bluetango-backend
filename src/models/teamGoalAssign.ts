import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const teamGoalAssignModel: any = sequelize.define("team_goal_assign", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    goal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    complete_measure: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "0=>request, 1=> approve, 2=> rejected"
    }
},
    {
        tableName: "team_goal_assign"
    }
);
teamGoalAssignModel.sync({ alter: true });
