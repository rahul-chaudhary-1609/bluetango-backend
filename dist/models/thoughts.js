"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.thoughtsModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.thoughtsModel = connection_1.sequelize.define("thoughts", {
    day: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    thought: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: "thoughts"
});
exports.thoughtsModel.sync({ alter: true });
//# sourceMappingURL=thoughts.js.map