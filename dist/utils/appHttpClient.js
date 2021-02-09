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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomString = exports.makeRequest = exports.getSecure = exports.getResp = void 0;
const https_1 = __importDefault(require("https"));
const crypto = require('crypto');
const accessKey = process.env.RAPYD_ACCESS_KEY;
const secretKey = process.env.RAPYD_SECRET_KEY;
const httpBaseURL = process.env.RAPYD_BASE_URL;
const log = false;
exports.getResp = (res) => {
    return new Promise(((resolve) => {
        let fullResp = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
            fullResp += chunk.toString();
        }).on("end", () => {
            resolve(fullResp);
        });
    }));
};
exports.getSecure = (url) => {
    return new Promise(((resolve, reject) => {
        https_1.default.get(url, (res) => {
            exports.getResp(res)
                .then((result) => {
                resolve(result);
            });
        }).on("error", (e) => {
            console.log(e);
        }).end();
    }));
};
exports.makeRequest = (method, urlPath, body = null) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const httpMethod = method, httpURLPath = urlPath, salt = exports.generateRandomString(8), idempotency = new Date().getTime().toString(), timestamp = Math.round(new Date().getTime() / 1000), signature = sign(httpMethod, httpURLPath, salt, timestamp, body);
        const options = {
            hostname: httpBaseURL,
            port: 443,
            path: httpURLPath,
            method: httpMethod,
            headers: {
                'Content-Type': 'application/json',
                salt: salt,
                timestamp: timestamp,
                signature: signature,
                access_key: accessKey,
                idempotency: idempotency
            }
        };
        return yield httpRequest(options, body, log);
    }
    catch (error) {
        console.error("Error generating request options");
        throw error;
    }
});
const sign = (method, urlPath, salt, timestamp, body) => {
    try {
        let bodyString = "";
        if (body) {
            bodyString = JSON.stringify(body);
            bodyString = bodyString == "{}" ? "" : bodyString;
        }
        let toSign = method.toLowerCase() + urlPath + salt + timestamp + accessKey + secretKey + bodyString;
        log && console.log(`toSign: ${toSign}`);
        let hash = crypto.createHmac('sha256', secretKey);
        hash.update(toSign);
        const signature = Buffer.from(hash.digest("hex")).toString("base64");
        log && console.log(`signature: ${signature}`);
        return signature;
    }
    catch (error) {
        console.error("Error generating signature");
        throw error;
    }
};
exports.generateRandomString = (size) => {
    try {
        return crypto.randomBytes(size).toString('hex');
    }
    catch (error) {
        console.error("Error generating salt");
        throw error;
    }
};
const httpRequest = (options, body, logging) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            let bodyString = "";
            if (body) {
                bodyString = JSON.stringify(body);
                bodyString = bodyString == "{}" ? "" : bodyString;
            }
            logging && console.log(`httpRequest options: ${JSON.stringify(options)}`);
            const req = https_1.default.request(options, (res) => {
                let response = {
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: ''
                };
                res.on('data', (data) => {
                    response.body += data;
                });
                res.on('end', () => {
                    response.body = response.body ? JSON.parse(response.body) : {};
                    log && console.log(`httpRequest response: ${JSON.stringify(response)}`);
                    if (response.statusCode !== 200) {
                        return reject(response);
                    }
                    return resolve(response);
                });
            });
            req.on('error', (error) => {
                return reject(error);
            });
            req.write(bodyString);
            req.end();
        }
        catch (err) {
            return reject(err);
        }
    });
});
//# sourceMappingURL=appHttpClient.js.map