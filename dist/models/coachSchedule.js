"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coachScheduleModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.coachScheduleModel = connection_1.sequelize.define("coach_schedules", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    slot_date_group_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    slot_time_group_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    coach_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    start_time: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    },
    end_time: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '1=>does_not_repeat, 2=>daily, 3=>weekly, 4=>every_week_day, 5=>custom'
    },
    day: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        comment: '0=>sunday, 1=>monday, 2=>tuesday, 3=>wednesday, 4=>thursday, 5=>friday, 6=>saturday'
    },
    custom_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    custom_dates: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.DATEONLY),
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '1=>available, 2=>booked, 3=> passed'
    },
    time_capture_type: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
        comment: '1=>available, 2=>unavailable'
    },
}, {
    tableName: "coach_schedules"
});
exports.coachScheduleModel.sync({ alter: false });
//# sourceMappingURL=coachSchedule.js.map