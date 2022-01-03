"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticContentModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.staticContentModel = connection_1.sequelize.define("static_content", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    pricing: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    contact_us: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    about_us: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    privacy_policy: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    terms_ondition: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: "static_content"
});
const data = [{ id: 1 }];
exports.staticContentModel.sync({ alter: false }).then(() => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield exports.staticContentModel.count();
    if (!count)
        exports.staticContentModel.bulkCreate(data);
}));
//# sourceMappingURL=staticContent.js.map