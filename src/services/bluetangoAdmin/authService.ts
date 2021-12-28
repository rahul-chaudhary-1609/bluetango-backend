import { adminModel } from "../../models/admin";
import { bluetangoAdminModel } from "../../models/bluetangoAdmin";
import _ from "lodash";
import * as constants from "../../constants";
import * as appUtils from "../../utils/appUtils";
import * as tokenResponse from "../../utils/tokenResponse";
import * as helperFunction from "../../utils/helperFunction";
import * as queryService from '../../queryService/bluetangoAdmin/queryService';
const generator = require('generate-password');
const Sequelize = require('sequelize');
var Op = Sequelize.Op;

export class AuthService {
    constructor() { }

    /**
    * login function
    @param {} params pass all parameters from request
    */
    public async login(params: any) {
        params.email=params.email.toLowerCase();
        let query:any={
            attributes:['id','name','email','password','country_code','phone_number','admin_role','status','permissions','social_media_handles'],
            where:{
                email:params.email,
                status:{
                    [Op.ne]:constants.STATUS.deleted
                }
            }
        }

        query.raw = true;

        let admin:any=await queryService.selectOne(bluetangoAdminModel,query);
        if(admin){
            let comparePassword = await appUtils.comparePassword(params.password, admin.password);
            if(comparePassword){
                if(admin.status==constants.STATUS.active){
                    delete admin.password;
                    let token = await tokenResponse.bluetangoAdminTokenResponse(admin);
                    admin.token=token;
                    return admin;
                }else{
                    throw new Error(constants.MESSAGES.deactivate_account);
                }
            }else{
                throw new Error(constants.MESSAGES.invalid_password);
            }
        }else{
            throw new Error(constants.MESSAGES.invalid_credentials);
        }

    }

    /**
    * add sub admin function
    @param {} params pass all parameters from request
    */
    public async addAdmin(params: any) {
        params.email=params.email.toLowerCase();

        let query:any={
            where:{
                [Op.or]:[
                    {
                        email:params.email,
                    },
                    {
                        phone_number:params.phone_number
                    },
                ],
                status:{
                    [Op.in]:[constants.STATUS.active,constants.STATUS.inactive]
                }
            }
        }

        let admin:any=await queryService.selectOne(bluetangoAdminModel,query);

        if(!admin){
                let password = generator.generate({
                    length: 10,
                    numbers: true,
                    symbols: true,
                    lowercase: true,
                    uppercase: true,
                    excludeSimilarCharacters: true,
                    strict:true,
                });
                params.admin_role=constants.USER_ROLE.sub_admin;
                params.password = await appUtils.bcryptPassword(password);
                let newAdmin=await queryService.addData(bluetangoAdminModel,params);
                newAdmin = newAdmin.get({plain:true});
                let token = await tokenResponse.bluetangoAdminTokenResponse(newAdmin);
                newAdmin.token=token;
                delete newAdmin.password;
                delete newAdmin.reset_pass_otp;
                delete newAdmin.reset_pass_expiry;
                const mailParams = <any>{};
                mailParams.to = params.email;
                mailParams.html = `Hi  ${params.name}
                <br>Use the given credentials for login into the admin pannel :
                
                <br><b> Web URL</b>: ${process.env.BLUETANGO_WEB_URL} <br>
                <br> email : ${params.email}
                <br> password : ${password}
                `;
                mailParams.subject = "Subadmin Login Credentials";
                mailParams.name="BlueTango"
                await helperFunction.sendEmail(mailParams);
                return newAdmin;
        }else{
            throw new Error(constants.MESSAGES.email_phone_already_registered)
        }
        
    }

    public async getProfile(user:any){
        let query:any={
            attributes:['id','name','email','country_code','phone_number','admin_role','status','permissions','social_media_handles','thought_of_the_day','profile_pic_url','createdAt','updatedAt'],
            where:{
                id:user.uid,
            }
        }

        let admin:any=await queryService.selectOne(bluetangoAdminModel,query);
        

        return admin;
    }

    /**
    * add sub admin function
    @param {} params pass all parameters from request
    */
    public async updateProfile(params: any,user:any) {
        params.email=params.email.toLowerCase();

        let query:any={
            where:{
                email:params.email,
                status:{
                    [Op.in]:[constants.STATUS.active,constants.STATUS.inactive]
                },
                id:{
                    [Op.ne]:user.uid,
                }
            }
        }

        let admin:any=await queryService.selectOne(bluetangoAdminModel,query);

        if(!admin){
                params.model=bluetangoAdminModel;
                query={
                    where:{
                        id:user.uid,
                    },
                    returning:true,
                    raw:true,
                }
                let updatedAdmin=await queryService.updateData(params,query);
                return updatedAdmin;
        }else{
            throw new Error(constants.MESSAGES.email_already_registered)
        }
        
    }

    /*
    * function to set new pass 
    */
    public async changePassword(params: any, user: any) {
        let query:any={
            where:{
                id:user.uid,
            }
        }
        
        let admin:any=await queryService.selectOne(bluetangoAdminModel,query);
        let comparePassword = await appUtils.comparePassword(params.old_password, admin.password);
        if(comparePassword){
            params.password= await appUtils.bcryptPassword(params.new_password)
            params.model=bluetangoAdminModel;

            await queryService.updateData(params,query);

            return true;
        }else{
            throw new Error(constants.MESSAGES.invalid_old_password);
        }
       
    }

  
     /**
     * reset password function to add the data
     * @param {*} params pass all parameters from request 
     */
      public async forgotPassword(params: any) {
        params.email=params.email.toLowerCase()

        let query:any = { 
            where: {
                email : params.email,
                status: {[Op.ne]: constants.STATUS.deleted}
            } 
        };

        query.raw=true;

        let admin:any=await queryService.selectOne(bluetangoAdminModel,query);

        if (admin) {
            let token = await tokenResponse.bluetangoForgotPasswordTokenResponse(admin);
            const mailParams = <any>{};
            mailParams.to = params.email;
            mailParams.html = `Hi ${admin.name}
                <br> Click on the link below to reset your password
                <br> ${process.env.BLUETANGO_RESET_PASS_URL}?token=${token.token}
                <br> Please Note: For security purposes, this link expires in ${process.env.FORGOT_PASSWORD_LINK_EXPIRE_IN_MINUTES} Hours.
                `;
            mailParams.subject = "Reset Password Request";
            mailParams.name="BlueTango"
            await helperFunction.sendEmail(mailParams);
            return true;
        } else {
            throw new Error(constants.MESSAGES.user_not_found);
        }

    }

    /*
    * function to set new pass 
    */
    public async resetPassword(params: any, user: any) {
        
        params.password= await appUtils.bcryptPassword(params.password)
        params.model=bluetangoAdminModel;

        let query:any ={ 
            where: {
                id : user.uid
            } 
        };

        await queryService.updateData(params,query);

        return true;
       
    }

     /*
    * function to upload file 
    */
     public async uploadFile(params: any, folderName) {
        return await helperFunction.uploadFile(params, folderName);
    }

    
    public async logout(params: any, user: any) {
        try {
            let update = {
                'token': null,
                'model': adminModel
            };
            let query:any ={ 
                where: {
                    id : user.uid
                } 
            };
            return await queryService.updateData(update, query);
        } catch (error) {
            throw new Error(error);
        }
    }
}