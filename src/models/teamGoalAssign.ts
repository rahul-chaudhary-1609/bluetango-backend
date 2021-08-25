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
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    last_submit_reminder_datetime: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: "2021-08-01"
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "0=>assign, 1=> approve, 2=> rejected, 3=> requested"
    },
    is_primary: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "0=>no, 1=> yes"
    }
},
    {
        tableName: "team_goal_assign"
    }
);
teamGoalAssignModel.sync({ alter: false });
