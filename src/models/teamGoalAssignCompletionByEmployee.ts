import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const teamGoalAssignCompletionByEmployeeModel: any = sequelize.define("team_goal_assign_completion_by_employee", {
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
    team_goal_assign_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
    complete_measure: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "1=> approved, 2=> rejected, 3=> requested"
    }
},
    {
        tableName: "team_goal_assign_completion_by_employee"
    }
);
teamGoalAssignCompletionByEmployeeModel.sync({ alter: false });
