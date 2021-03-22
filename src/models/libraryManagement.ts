import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const libraryManagementModel: any = sequelize.define("library_management", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    video: {
        type: DataTypes.TEXT,
        allowNull: false
    }
},
    {
        tableName: "library_management"
    }
);
libraryManagementModel.sync({ alter: false });
