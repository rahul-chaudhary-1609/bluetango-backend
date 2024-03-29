import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const achievementHighFiveModel: any = sequelize.define("achievement_high_fives", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    high_fived_by_employee_id: {
        type: DataTypes.INTEGER,
    },
    achievement_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    }
},
    {
        tableName: "achievement_high_fives"
    }
);
achievementHighFiveModel.sync({ alter: false });
