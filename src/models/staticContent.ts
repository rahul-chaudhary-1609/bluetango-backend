import { DataTypes, Sequelize } from "sequelize";

import { sequelize } from "../connection";

export const staticContentModel: any = sequelize.define("static_content", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    pricing: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    contact_us: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    about_us: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    privacy_policy: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    terms_ondition: {
        type: DataTypes.TEXT,
        allowNull: true
    }
},
    {
        tableName: "static_content"
    }
);
const data = [{ id: 1 }]
staticContentModel.sync({ alter: false }).then(async () => {
    const count = await staticContentModel.count()
    if (!count)
    staticContentModel.bulkCreate(data)
});