"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zoomUserModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.zoomUserModel = connection_1.sequelize.define("zoom_users", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    zoom_user_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '1=>coach,1=>employee'
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    },
    details: {
        type: sequelize_1.DataTypes.JSON,
    },
}, {
    tableName: "zoom_users"
});
exports.zoomUserModel.sync({ alter: true });
//# sourceMappingURL=zoomUsers.js.map