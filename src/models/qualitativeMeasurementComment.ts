import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const qualitativeMeasurementCommentModel: any = sequelize.define("qualitattive_measurement_comment", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    label: {
        type: DataTypes.STRING,
        allowNull: true
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
        tableName: "qualitattive_measurement_comment"
    }
);
qualitativeMeasurementCommentModel.sync({ alter: true });
