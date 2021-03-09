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
    comment: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: "qualitattive_measurement_comment"
});
exports.qualitativeMeasurementCommentModel.sync({ alter: false });
//# sourceMappingURL=qualitativeMeasurementComment.js.map