"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coachBiosModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.coachBiosModel = connection_1.sequelize.define("coach_bios", {
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
    coach_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    image: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    fileName: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
}, {
    tableName: "coach_bios"
});
exports.coachBiosModel.sync({ alter: true });
//# sourceMappingURL=coachBios.js.map