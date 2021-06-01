import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const feedbackModel: any = sequelize.define("feedback", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
    },
    feedback_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 4,
        comment: '1=>employee, 2=>employer, 3=>coach, 4=> other'
    },
    status: {//applicable for all type of users
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    }
},
    {
        tableName: "feedback"
    }
);
feedbackModel.sync({ alter: true });