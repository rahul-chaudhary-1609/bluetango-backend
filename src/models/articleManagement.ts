import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const articleManagementModel: any = sequelize.define("article_management", {
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
    image: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    },
    fileName: {
        type: DataTypes.TEXT,
        allowNull: true
    }
},
    {
        tableName: "article_management"
    }
);
articleManagementModel.sync({ alter: false});
