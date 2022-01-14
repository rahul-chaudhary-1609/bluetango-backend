"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bluetangoAdminRolesModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.bluetangoAdminRolesModel = connection_1.sequelize.define("bluetango_admin_roles", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    role_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active'
    },
    module_wise_permissions: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.JSONB),
        allowNull: true,
    },
}, {
    tableName: "bluetango_admin_roles"
});
exports.bluetangoAdminRolesModel.sync({ alter: true });
//# sourceMappingURL=bluetangoAdminRoles.js.map