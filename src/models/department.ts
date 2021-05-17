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
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    },
},
    {
        tableName: "department"
    }
);
departmentModel.sync({ alter: false });
