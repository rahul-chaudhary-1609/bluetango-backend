import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const teamGoalAssignCompletionByEmployee: any = sequelize.define("team_goal_assign_completion_by_employee", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    team_goal_assign_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
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
        comment: "1=> approve, 2=> rejected, 3=> requested"
    }
},
    {
        tableName: "team_goal_assign_completion_by_employee"
    }
);
teamGoalAssignCompletionByEmployee.sync({ alter: true });
