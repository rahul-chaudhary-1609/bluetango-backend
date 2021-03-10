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
    comment: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
},
    {
        tableName: "qualitattive_measurement_comment"
    }
);
qualitativeMeasurementCommentModel.sync({ alter: false });
