import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const achievementModel: any = sequelize.define("achievements", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    last_action_on: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    },
    like_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    high_five_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    comment_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
},
    {
        tableName: "achievements"
    }
);
achievementModel.sync({ alter: false });
