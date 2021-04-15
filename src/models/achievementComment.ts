import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const achievementCommentModel: any = sequelize.define("achievement_comments", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    commented_by_employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    achievement_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    commented_by_employee_details: {
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
        tableName: "achievement_comments"
    }
);
achievementCommentModel.sync({ alter: true });
