"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTIFICATION_TYPE = exports.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS = exports.USER_ROLE = exports.notificationmsg = exports.CUSTOM_JOI_MESSAGE = exports.OFFSET_LIMIT = exports.otp_expiry_time = exports.defaultServerResponse = exports.FORGOT_PASSWORD_SECRET_KEY = exports.EMPLOYER_SECRET_KEY = exports.EMPLOYEE_SECRET_KEY = exports.EMAIL_SECRET_KEY = exports.ADMIN_SECRET_KEY = exports.SECRET_KEY = exports.mobile_otp_message = exports.ROUTE_PREFIX = exports.code = exports.MESSAGES = void 0;
exports.MESSAGES = {
    phone_already_registered: "An account with given phone number already exists",
    email_already_registered: "An account with given email already exists",
    email_phone_already_registered: "An account with given email or phone already exists",
    invalid_password: "Incorrect Password",
    invalid_email: "Incorrect Email",
    deactivate_account: 'Your account has been de-activated by Admin. Please contact to admin',
    delete_account: 'Your account has been deleted by Admin. Please contact to admin',
    not_same_password: "New Password should not be same as the Current Password",
    current_password_not_match: "Current Password Not matches with the existing one",
    signup_success: 'Signup Success',
    login_success: 'Login Success',
    duplicate_value: 'You are trying to add duplicate value',
    request_validation_message: 'Invalid fields',
    verify_success: 'User verified successfully',
    token_missing: 'Token missing from header',
    user_not_found: 'An account with given info does not exist',
    invalid_otp: "Invalid OTP",
    expire_otp: "OTP expired, please resend the OTP",
    resend_otp_success: "OTP resend successfully",
    otp_updated_success: "OTP send successfully",
    otp_verified_success: "OTP verified successfully",
    invalid_field: "pass the proper fields",
    update_user_details: "User Details Updated Successfully",
    reset_password_success: "password reset successfully",
    password_change_success: "Password changed successfully",
    model_name_required: "please pass model name also",
    invalid_credentials: "Please enter Valid Email ID",
    user_profile_success: "User Profile Success",
    exception_occured: "Something went wrong! please try again",
    bad_request: "Getting error, due to bad request",
    phone_not_verified: "Your phone number is not verified yet",
    logout_success: "You have successfully logged out",
    unauthorized_role: "Your role is unauthorized to perform this action",
    fetch_success: "List has been fetched successfully",
    data_success: "Data has been fetched successfully",
    acc_already_exists: "An account already exists with these credentials",
    password_miss_match: "Password & confirm password are not the same",
    invalid_passkey: "Invalid access passkey",
    enter_email: "Please enter your emailId",
    file_upload_error: "Error in uploding file/files",
    file_upload_success: "File has been uploaded successfully",
    action_success: "Status is updated successfully",
    industry_list: "Employers industry type list fetched successfully",
    employers_list: 'Employers lists',
    forget_pass_otp: "Password reset link has been sent to your registered email id",
    reset_pass_success: "Password reset successfully",
    invalid_email_token: "",
    success: 'Success',
    invalid_department: "Invalid department is provided",
    invalid_employer: "Invalid employer id",
    invalid_action: "Invalid action request",
    already_activated: "Already activated",
    already_deactivated: "Already deactivated",
    already_deleted: "Already deleted",
    status_updated: "Status updated successfully",
    manager_id_required: 'Manager id is required',
    goal_management_check: "Goal management only for manager",
    invalid_measure: 'Invalid measure value in request',
    dashboardAnalyticsCount: 'Dashboard analytics count fetched successfully',
    employer_notFound: 'Employer not found',
    employee_list: 'Employees list',
    add_qualitative_measure_check: 'You are not elligible to rate qualitative measure',
    invalid_employee_id: 'Invalid employee id, You can rate only your empoyee',
    invalid_employee: "Invalid employee id",
    employee_update: "Employee details updated successfully",
    plan_notFound: "No plans found with this id",
    subscription_plan_update: "Subscription plan updated successfully",
    subscription_plan_add: "Subscription plan added successfully",
    subscription_plan_fetch: "Subscription plan fetched successfully",
    payment_list_fetch: "Payment List Fetched successfully",
    payment_detail_fetch: "Payment details fetched successfully"
};
exports.code = {
    error_code: 400
};
exports.ROUTE_PREFIX = {
    NEW_BASE_PATH: "/api/",
};
exports.mobile_otp_message = 'Your one time password is ';
exports.SECRET_KEY = "A!@#$%^";
exports.ADMIN_SECRET_KEY = "S$%^!@#K";
exports.EMAIL_SECRET_KEY = "S$%^K@*S";
exports.EMPLOYEE_SECRET_KEY = "EE$%^!@#K";
exports.EMPLOYER_SECRET_KEY = "ER$%^!@#K";
exports.FORGOT_PASSWORD_SECRET_KEY = "FORKEY$%^!@#K";
exports.defaultServerResponse = {
    status: 400,
    success: false,
    message: '',
    body: {}
};
exports.otp_expiry_time = 30 * 60 * 1000;
exports.OFFSET_LIMIT = 10;
exports.CUSTOM_JOI_MESSAGE = {
    password_msg: {
        min: "Password must have minimum 8 characters",
        max: "Password can not have more than 15 characters",
        base: "Password must be string",
        required: "Password is required",
        pattern: "Password must have 8-15 characters comprising one caps, one small, one number and one special character"
    }
};
exports.notificationmsg = {};
exports.USER_ROLE = {
    super_admin: 1,
    sub_admin: 2,
    employee: 3,
    employer: 4
};
exports.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS = {
    approve: 1,
    rejected: 2,
    requested: 3
};
exports.NOTIFICATION_TYPE = {
    other: 0,
    assign_new_goal: 1,
    goal_complete_request: 2,
    rating: 3,
    message: 4,
    goal_accept: 5,
    goal_reject: 6
};
//# sourceMappingURL=constants.js.map