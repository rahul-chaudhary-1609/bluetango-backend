import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const teamGoalModel: any = sequelize.define("team_goal", {
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
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    select_measure: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "1=>Amount, 2=> Quantity",
    },
    enter_measure: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},
    {
        tableName: "team_goal"
    }
);
teamGoalModel.sync({ alter: false });
