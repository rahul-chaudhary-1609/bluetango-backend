"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.libraryManagementModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.libraryManagementModel = connection_1.sequelize.define("library_management", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    admin_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    video: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    }
}, {
    tableName: "library_management"
});
exports.libraryManagementModel.sync({ alter: false });
//# sourceMappingURL=libraryManagement.js.map