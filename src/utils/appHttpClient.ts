import https from 'https';
const crypto = require('crypto');
const accessKey = process.env.RAPYD_ACCESS_KEY;
const secretKey = process.env.RAPYD_SECRET_KEY;
const httpBaseURL = process.env.RAPYD_BASE_URL;
const log = false;

export const getResp = (res: any) => {
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

export const getSecure = (url: any) => {
    return new Promise(((resolve, reject) => {
        https.get(url, (res) => {
            getResp(res)
                .then((result) => {
                    resolve(result);
                });
        }).on("error", (e) => {
            console.log(e);
        }).end();
    }));
};

export const makeRequest = async(method, urlPath: string, body = null) => {
    try {
        const httpMethod = method,
        httpURLPath = urlPath,
        salt = generateRandomString(8),
        idempotency = new Date().getTime().toString(),
        timestamp = Math.round(new Date().getTime() / 1000),
        signature = sign(httpMethod, httpURLPath, salt, timestamp, body);

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
        }

        return await httpRequest(options, body, log);
    }
    catch (error) {
        console.error("Error generating request options");
        throw error;
    }
}

const sign = (method: string, urlPath: string, salt: string, timestamp, body) => {
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
        const signature = Buffer.from(hash.digest("hex")).toString("base64")
        log && console.log(`signature: ${signature}`);

        return signature;
    }
    catch (error) {
        console.error("Error generating signature");
        throw error;
    }
}

export const generateRandomString = (size: number) => {
    try {
        return crypto.randomBytes(size).toString('hex');
    }
    catch (error) {
        console.error("Error generating salt");
        throw error;
    }
}

const httpRequest = async (options, body, logging) => {
    return new Promise((resolve, reject) => {
        try {
            let bodyString = "";
            if (body) {
                bodyString = JSON.stringify(body);
                bodyString = bodyString == "{}" ? "" : bodyString;
            }

            logging && console.log(`httpRequest options: ${JSON.stringify(options)}`);
            const req = https.request(options, (res) => {
                let response = {
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: ''
                };

                res.on('data', (data) => {
                    response.body += data;
                });

                res.on('end', () => {

                    response.body = response.body ? JSON.parse(response.body) : {}
                    log && console.log(`httpRequest response: ${JSON.stringify(response)}`);

                    if (response.statusCode !== 200) {
                        return reject(response);
                    }

                    return resolve(response);
                });
            })
            
            req.on('error', (error) => {
                return reject(error);
            })
            
            req.write(bodyString)
            req.end();
        }
        catch(err) {
            return reject(err);
        }
    })
}