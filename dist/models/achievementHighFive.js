"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.achievementHighFiveModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.achievementHighFiveModel = connection_1.sequelize.define("achievement_high_fives", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    achievement_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    high_fived_by: {
        type: sequelize_1.DataTypes.JSON,
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    }
}, {
    tableName: "achievement_high_fives"
});
exports.achievementHighFiveModel.sync({ alter: false });
//# sourceMappingURL=achievementHighFive.js.map