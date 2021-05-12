"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qualitativeMeasurementCommentModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.qualitativeMeasurementCommentModel = connection_1.sequelize.define("qualitattive_measurement_comment", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    label: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    comment: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    },
}, {
    tableName: "qualitattive_measurement_comment"
});
exports.qualitativeMeasurementCommentModel.sync({ alter: true });
//# sourceMappingURL=qualitativeMeasurementComment.js.map