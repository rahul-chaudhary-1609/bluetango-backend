import { DataTypes, QueryInterface } from "sequelize";

import { sequelize } from "../connection";

export const industryTypeModel: any = sequelize.define("industry_type", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    }
},
    {
        tableName: "industry_type"
    }
);
industryTypeModel.sync({ alter: true });