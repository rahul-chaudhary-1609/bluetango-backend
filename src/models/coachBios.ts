import { DataTypes, Sequelize } from "sequelize";

import { sequelize } from "../connection";

export const coachBiosModel: any = sequelize.define("coach_bios", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    coach_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true
    }
},
    {
        tableName: "coach_bios"
    }
);
coachBiosModel.sync({ alter: false });