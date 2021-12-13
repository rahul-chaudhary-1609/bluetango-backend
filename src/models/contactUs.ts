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
    },
    employee_id: {
        type: DataTypes.INTEGER,
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
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "0=> none, 1=> employee, 2=> employer, 3=>coach"
    },    
},
    {
        tableName: "contact_us"
    }
);
contactUsModel.sync({ alter: true });