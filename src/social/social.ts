import * as appHttpClient from "../utils/appHttpClient";
const FB_PROFILE_FETCH_URL = "https://graph.facebook.com/me?fields=id,email,name,picture{url}&access_token=";
const GOOGLE_PROFILE_FETCH_URL = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=";
const APPLE_PROFILE_FETCH_URL = "https://appleid.apple.com/auth/keys";

export const getFBProfile = async (token: any) => {
    try {
        let resp: any = '';
        resp = await appHttpClient.getSecure(FB_PROFILE_FETCH_URL + token);
        const returnVal = JSON.parse(resp);
        return returnVal;
    }
    catch (error) {
        throw new Error(error);
    }
};

export const getGoogleProfile = async (token: any) => {
    try {
        let resp: any = '';
        resp = await appHttpClient.getSecure(GOOGLE_PROFILE_FETCH_URL + token);
        const returnVal = JSON.parse(resp);
        return returnVal;
    }
    catch (error) {
        throw new Error(error);
    }
};

export const getAppleProfile = async (token: any) => {
    try {
        let resp: any = '';
        resp = await appHttpClient.getSecure(APPLE_PROFILE_FETCH_URL);
        const returnVal = JSON.parse(resp);
        return returnVal;
    }
    catch (error) {
        throw new Error(error);
    }
};