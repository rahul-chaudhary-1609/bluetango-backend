import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const contactUsModel: any = sequelize.define("contact_us", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    employer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {//applicable for all type of users
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    }
},
    {
        tableName: "contact_us"
    }
);
contactUsModel.sync({ alter: true });