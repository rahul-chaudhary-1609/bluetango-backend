"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coachSpecializationCategoriesModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.coachSpecializationCategoriesModel = connection_1.sequelize.define("coach_specialization_categories", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    }
}, {
    tableName: "coach_specialization_categories"
});
exports.coachSpecializationCategoriesModel.sync({ alter: true });
//# sourceMappingURL=coachSpecializationCategories.js.map