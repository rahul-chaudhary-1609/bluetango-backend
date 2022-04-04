"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attributeRatingModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.attributeRatingModel = connection_1.sequelize.define("attributeRatings", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    manager_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    employee_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    start_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    ratings: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.JSON),
        allowNull: false,
    },
}, {
    tableName: "attributeRatings"
});
exports.attributeRatingModel.sync({ alter: true });
//# sourceMappingURL=attributeRatings.js.map