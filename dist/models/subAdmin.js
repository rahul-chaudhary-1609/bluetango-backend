"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subAdminModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.subAdminModel = connection_1.sequelize.define("sub_admin", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    phone_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    permission: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    },
}, {
    tableName: "sub_admin"
});
exports.subAdminModel.sync({ alter: false });
//# sourceMappingURL=subAdmin.js.map