"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attributeModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.attributeModel = connection_1.sequelize.define("attributes", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    employer_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
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
    tableName: "attributes"
});
exports.attributeModel.sync({ alter: true });
//# sourceMappingURL=attributes.js.map