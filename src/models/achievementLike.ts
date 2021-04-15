import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const achievementLikeModel: any = sequelize.define("achievement_likes", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    liked_by_employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    achievement_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    liked_by_employee_details: {
        type: DataTypes.JSON,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    }
},
    {
        tableName: "achievement_likes"
    }
);
achievementLikeModel.sync({ alter: true });
