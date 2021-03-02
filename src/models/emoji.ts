import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const emojiModel: any = sequelize.define("emoji", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    caption: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},
    {
        tableName: "emoji"
    }
);
emojiModel.sync({ alter: false });
