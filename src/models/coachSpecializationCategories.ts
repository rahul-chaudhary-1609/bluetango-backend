import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const coachSpecializationCategoriesModel: any = sequelize.define("coach_specialization_categories", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    }
},
    {
        tableName: "coach_specialization_categories"
    }
);
coachSpecializationCategoriesModel.sync({ alter: true });