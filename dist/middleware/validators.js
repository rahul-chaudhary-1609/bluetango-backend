"use strict";
// export const trimmer = (req, res, next) => {
//     if (req.method === 'POST') {
//         for (const [key, value] of Object.entries(req.body)) {
//             req.body[key] = (<any>value).trim();
//         }
//     }
//     next();
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUsername = exports.isValidEmail = exports.trimmer = void 0;
exports.trimmer = (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        const temp = {};
        for (let [key, value] of Object.entries(req.body)) {
            key = key.trim();
            if (isNaN(value)) {
                temp[key] = value.trim();
            }
            else {
                temp[key] = value.toString();
            }
        }
        req.body = temp;
    }
    if (req.method == 'GET' || req.method == 'DELETE') {
        const temp = {};
        for (let [key, value] of Object.entries(req.query)) {
            key = key.trim();
            if (isNaN(value)) {
                temp[key] = value.trim();
            }
            else {
                temp[key] = (value.toString()).trim();
            }
        }
        req.query = temp;
    }
    next();
};
exports.isValidEmail = (email) => {
    return /^\S+@\S+\.\S+/.test(email);
};
exports.formatUsername = (req, res, next) => {
    const username = req.body.username || req.body.phone;
    if (username) {
        if (exports.isValidEmail(username)) {
            //email -- skip formatting
        }
        else {
            //phone remove white space and -
            if (req.body.username)
                req.body.username = username.replace(/[^\d]/g, '');
            if (req.body.phone)
                req.body.phone = username.replace(/[^\d]/g, '');
        }
    }
    next();
};
//# sourceMappingURL=validators.js.map