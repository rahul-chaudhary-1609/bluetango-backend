import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const attributeModel: any = sequelize.define("attributes", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    employer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    comment: {
        type: DataTypes.TEXT,
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
        tableName: "attributes"
    }
);
attributeModel.sync({ alter: true });
