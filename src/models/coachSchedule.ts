import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const coachScheduleModel: any = sequelize.define("coach_schedules", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    slot_date_group_id:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    slot_time_group_id:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    coach_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date:{
        type:DataTypes.DATEONLY,
        allowNull:false,
    },
    start_time:{
        type:DataTypes.TIME,
        allowNull:false,
    },
    end_time:{
        type:DataTypes.TIME,
        allowNull:false,
    },
    type:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '1=>does_not_repeat, 2=>daily, 3=>weekly, 4=>every_week_day, 5=>custom'
    },
    day:{
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '0=>sunday, 1=>monday, 2=>tuesday, 3=>wednesday, 4=>thursday, 5=>friday, 6=>saturday'
    },
    custom_date:{
        type:DataTypes.DATE,
        allowNull:true,
    },
    custom_dates:{
        type:DataTypes.ARRAY(DataTypes.DATEONLY),
        allowNull:true,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '1=>available, 2=>in_process, 3=>booked, 4=> passed'
    }
},
    {
        tableName: "coach_schedules"
    }
);
coachScheduleModel.sync({ alter: false });