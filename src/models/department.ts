import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const departmentModel: any = sequelize.define("department", {
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
        tableName: "department"
    }
);
departmentModel.sync({ alter: true });
