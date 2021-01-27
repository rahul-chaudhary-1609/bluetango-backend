// export const trimmer = (req, res, next) => {
//     if (req.method === 'POST') {
//         for (const [key, value] of Object.entries(req.body)) {
//             req.body[key] = (<any>value).trim();
//         }
//     }
//     next();
// }

export const trimmer = (req, res, next) => {
    if (req.method === 'POST') {
        const temp = {};
        for (let [key, value] of Object.entries(req.body)) {
            key = (<any>key).trim();
            if (isNaN(<any>value)) {
                temp[key] = (<any>value).trim();
            } else {
                temp[key] = (<any>value).toString();
            }
            
        }
        req.body = temp;
    }

    if (req.method == 'GET') {
        const temp = {};
        for (let [key, value] of Object.entries(req.query)) {
            key = (<any>key).trim();
            if (isNaN(<any>value)) {
                temp[key] = (<any>value).trim();
            } else {
                temp[key] = (<any>value).toString();
            }
            
        }
        req.query = temp;
    }
    
    next();
}

export const isValidEmail = (email) => {
    return /^\S+@\S+\.\S+/.test(email);
}

export const formatUsername = (req, res, next) => {
    const username = req.body.username || req.body.phone
    if(username) {
        if(isValidEmail(username)) {
            //email -- skip formatting
        } else {
            //phone remove white space and -
            if(req.body.username)
                req.body.username = username.replace(/[^\d]/g, '')
            if(req.body.phone)
                req.body.phone = username.replace(/[^\d]/g, '')
        }
    }
    next()
}