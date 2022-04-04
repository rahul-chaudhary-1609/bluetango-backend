import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const employeeRanksModel: any = sequelize.define("employee_ranks", {
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
        tableName: "employee_ranks"
    }
);
employeeRanksModel.sync({ alter: true });