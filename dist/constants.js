"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACTION_BY = exports.SESSION_ACTION = exports.DEFAAULT_START_END_TIME = exports.TIME_CAPTURE_TYPE = exports.COACH_APP_ID = exports.ADMIN_PERMISSION = exports.CONTACT_TYPE = exports.ZOOM_USER_TYPE = exports.COACH_SCHEDULE_SLOT_GROUP_DELETE_TYPE = exports.COACH_SCHEDULE_SLOT_DELETE_TYPE = exports.COACH_SCHEDULE_DAY = exports.COACH_SCHEDULE_TYPE = exports.COACH_SCHEDULE_STATUS = exports.EMPLOYEE_COACH_SESSION_STATUS = exports.EMPLOYEE_COACH_SESSION_TYPE = exports.EMPLOYEE_COACH_SESSION_CANCELLED_BY = exports.IS_PAGINATION = exports.URLS = exports.TIME_ZONE = exports.SECRETS = exports.FEEDBACK_TYPE = exports.CHAT_DISCONNECT_TYPE = exports.EMPLOYER_FREE_TRIAL_STATUS = exports.EMPLOYER_SUBSCRIPTION_TYPE = exports.CHAT_ROOM_TYPE = exports.PRIMARY_GOAL = exports.STATUS = exports.BLUETANGO_CHAT_USER_TYPE = exports.CHAT_USER_TYPE = exports.NOTIFICATION_RECIEVER_TYPE = exports.BLUETANGO_NOTIFICATION_TYPE = exports.NOTIFICATION_TYPE = exports.EMPLOYER_SUBSCRIPTION_PLAN_STATUS = exports.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS = exports.USER_ROLE = exports.EMPLOYER_FREE_TRIAL_DURATION = exports.notificationmsg = exports.CUSTOM_JOI_MESSAGE = exports.OFFSET_LIMIT = exports.otp_expiry_time = exports.defaultServerResponse = exports.BLUETANGO_FORGOT_PASSWORD_SECRET_KEY = exports.FORGOT_PASSWORD_SECRET_KEY = exports.COACH_SECRET_KEY = exports.EMPLOYER_SECRET_KEY = exports.EMPLOYEE_SECRET_KEY = exports.EMAIL_SECRET_KEY = exports.ADMIN_SECRET_KEY = exports.BLUETANGO_ADMIN_SECRET_KEY = exports.SECRET_KEY = exports.mobile_otp_message = exports.ROUTE_PREFIX = exports.code = exports.HOST_URL = exports.MESSAGES = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.MESSAGES = {
    phone_already_registered: "An account with given phone number already exists",
    email_already_registered: "An account with given email already exists",
    email_phone_already_registered: "An account with given email or phone already exists",
    employee_code_already_registered: "An account with given employee code already exists",
    invalid_password: "Incorrect Password",
    invalid_old_password: "Incorrect old password",
    invalid_email: "Incorrect Email",
    deactivate_account: 'Your account has been de-activated by Admin. Please contact to admin',
    delete_account: 'Your account has been deleted by Admin. Please contact to admin',
    deactivate_employer_account: 'Your employer account has been de-activated by Admin. Please contact to your employer',
    delete_employer_account: 'Your employer account has been deleted by Admin. Please contact to your employer',
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
    invalid_employee_rank: "Invalid employee rank is provided",
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
    payment_detail_fetch: "Payment details fetched successfully",
    invalid_date_format: "Invalid date format",
    employer_add_update: "Employer added/updated",
    password_not_provided: "Pease enter password",
    employer_details_fetched: "Employer details fetched successfully",
    coach_add_update: "Coach added/updated successfully",
    coach_list_fetched: "Coach list fetched successfully",
    coach_deleted: "Coach deleted",
    employee_deleted: "employee deleted",
    coach_not_found: "Coach not found",
    coach_details_fetched: "Coach details fetched successfully",
    contact_list_fetched: "Contact us list fetched successfully",
    email_notification_sent: "Email/Notification sent successfully",
    employee_details_fetched: "Employee details fetched successfully",
    employee_notFound: "Employee not found",
    department_list_fetched: "Department list fetched successfully",
    json_format_csv: "Json format of csv fetched successfully",
    invalid_plan: "Invalid subscription plan",
    subscription_status_updated: "Subscription plan status updated",
    subAdmin_fetched: "SubAdmin fetched successfully",
    subAdmin_details_fetched: "SubAdmin details fetched successfully",
    subAdmin_not_found: "SubAdmin not found",
    invalid_admin: "Only super admin can add subAdmin",
    contact_details_fetched: "Contact Us details fetched",
    subAdmin_added: "Admins added successfully",
    subAdmin_updated: "Sub admin updated successfully",
    invalid_subAdmin: "Invalid sub admin",
    library_video_added: "Library video added",
    invalid_library: "invalid library",
    library_video_updated: "Library video updated",
    library_video_fetched: "Library video fetched",
    article_added: "Aricle added",
    article_updated: "Article updated",
    article_fetched: "Article fetched",
    article_details_fetched: "Article details fetched",
    invalid_article: "Invalid article",
    self_chat: "You can not chat with yourself",
    top_level_manager: `This is the top-level manager. Only your employees can start a chat`,
    advisor_added: "Advisor added",
    advisor_fetched: "Advisor list fetched",
    advisor_updated: "Advisor updated",
    invalid_advisor: "Invalid advisor",
    only_manager_chat: "You can initiate chat with your manager only",
    only_manager_or_coach_chat: "You can initiate chat either with your manager or with a coach",
    only_coach_chat: "You can initiate chat with a coach only",
    chat_room_notFound: "chat room not found",
    video_chat_session_create_error: "Error in video chat session creation",
    video_chat_session_created: "Session created",
    advisor_details_fetched: "Advisor details fetched",
    no_qualitative_measure: "No qualitative measure found",
    no_achievement_comment: "user have not commented anything on this achievement",
    no_achievement: "no achievement found",
    team_goal_complete_request_pending: "You already have a pending request for approval",
    employer_no_plan: "You do not have any active plan to avail this service",
    employer_have_no_plan: "You do not have any active plan.",
    employee_employer_have_no_plan: "We are facing some issue with your account. Please contact your employer.",
    employer_have_free_plan: "You are in 14 days of free trial",
    employer_have_paid_plan: "You have an active plan",
    no_plan: "Subscription does not exist",
    not_manager: "manager token is required",
    chat_room_required: "Chat room id is required in case of chat message only type",
    firebase_firestore_doc_not_created: `Firebase doc with chat room not created`,
    firebase_firestore_doc_not_updated: `Firebase doc with chat room not updated`,
    manager_team_name_required: `Manager team name is required if employee is a manager`,
    manager_team_icon_url_required: `Manager team icon url is required if employee is a manager`,
    payment_success: `Payment Successfull!`,
    payment_faliled: `Payment failed!`,
    employer_free_trial_already_started: `Free trial already started`,
    employer_free_trial_already_exhausted: `Free trial already exhausted`,
    goal_not_assigned: `This goal is not assigned to you`,
    goal_assign_not_found: `No goal assined found with this id`,
    four_goal_assign_not_found: `Either at least one of these four goal assign IDs does not match the goals assigned to this employee or at least one of these goal assign IDs does not exist`,
    only_four_primary_goals_are_allowed: `Exactly 4 goals can be marked as primary at a time. No less no more`,
    attribute_already_added: `An attribute with the same name/label already exist.`,
    attribute_not_found: `Either no attribute exist with this id or it does not belogs to current employer`,
    no_feedback: `No feedback found`,
    no_coach_specialization_category: `No specialization category found`,
    no_coach_with_specialization_category: `No coach found with this specialization category`,
    coach_specialization_category_already_exist: `A coach specialization category with the same name already exist.`,
    no_employee_rank: `No employee rank found`,
    employee_rank_already_exist: `A employee rank with the same name already exist.`,
    coach_specialization_category_delete_error: `If a coach belongs to a particular coach specialization category then that coach specialization category cannot be deleted.`,
    employee_rank_delete_employee_error: `If an employee belongs to a particular employee rank then that employee rank cannot be deleted.`,
    employee_rank_delete_coach_error: `If a coach belongs to a particular employee rank then that employee rank cannot be deleted.`,
    delete_success: `Deleted Successfully`,
    no_coach: `No coach found`,
    no_session: `No session found`,
    session_not_belogs_to_coach: `This session is not belongs to you`,
    session_not_belogs_to_employee: `This session is not belongs to you`,
    coach_schedule_day_required: `Day is required if slot type is weekly`,
    coach_schedule_custom_dates_required: `Custom dates is/are required if slot type is custom`,
    coach_schedule_already_exist: `This schedule time has some conflicts with existing slot(s).`,
    no_coach_schedule: `No slot found`,
    coach_schedule_not_available: `This slot is not available.`,
    slot_id_required: `Slot id is required in case of individual delete`,
    slot_date_group_id_required: `Slot date group id is required in case of date group delete`,
    slot_time_group_id_required: `Slot time group id is required in case of time group delete`,
    slot_group_delete_date_required: `Current date is required in case of group delete`,
    coach_schedule_overlaped: `The recieved slots must have one or more overlaped time values.\nPlease check, fix, and create again`,
    coach_schedule_start_greater_or_equal_end: `For each slots start time must be less than end time`,
    zoom_cancel_meeting_error: `Something went wrong with canceling the zoom meeting`,
    zoom_end_meeting_error: `Something went wrong with ending the zoom meeting`,
    zoom_update_meeting_error: `Something went wrong with updating the zoom meeting`,
    zoom_schedule_meeting_error: `Something went wrong with scheduling the zoom meeting`,
    zoom_meeting_not_found: `Meeting with this {meetingId} is not found or has expired.`,
    zoom_meeting_emp_cancel_error: `You can cancel a meeting until it has just started`,
    zoom_meeting_coach_cancel_error: `You can cancel a meeting until it's over`,
    biosAdded: 'Bios added successfully',
    bios_already_exist: 'Bios already exists for this coach',
    bios_not_exist: 'Bios not exists for this coach',
    biosUpdated: 'Bios updated successfully',
    biosDeleted: 'Bios deleted successfully',
    staticContentUpdated: 'Static content updated successfully',
    session_details_fetched: "Session details fetched successfully",
    available_coaches_fetched: "Available coaches fetched successfully",
    admin_deleted: "Admin deleted successfully",
    role_already_exist: "Role already exist",
    role_details_fetched: "Role details fetched successfully",
    role_deleted: "Role deleted successfully",
    admin_And_role_updated: "Admin and role details updated successfully",
    admin_and_role_status: "Admin and role status updated successfully",
    role_fetched: "Roles fetched successfully",
    select_appId: "Select BluXinga or BlueTango for login",
    only_employee_or_BT_Admin_chat: "You can initiate chat either with employee or with a admin",
    admin_him_self_delete: "Admin will not remove himself",
    admin_role_delete: "Admin cannot delete his own role",
    coach_bios_detail: "Coach Bio details fetched successfully",
    invalid_toke: "Invalid token",
    thoughts_uploaded: "Thoughts uploaded successfully",
    thoughts_downloaded: "Thoughts downloaded successfully"
};
exports.HOST_URL = process.env.HOST_URL;
exports.code = {
    error_code: 400
};
exports.ROUTE_PREFIX = {
    NEW_BASE_PATH: "/api/",
};
exports.mobile_otp_message = 'Your one time password is ';
exports.SECRET_KEY = "A!@#$%^";
exports.BLUETANGO_ADMIN_SECRET_KEY = "S$%^!@#K";
exports.ADMIN_SECRET_KEY = "S$%^!@#K";
exports.EMAIL_SECRET_KEY = "S$%^K@*S";
exports.EMPLOYEE_SECRET_KEY = "EE$%^!@#K";
exports.EMPLOYER_SECRET_KEY = "ER$%^!@#K";
exports.COACH_SECRET_KEY = "ER$%^!@#K";
exports.FORGOT_PASSWORD_SECRET_KEY = "FORKEY$%^!@#K";
exports.BLUETANGO_FORGOT_PASSWORD_SECRET_KEY = "FORKEY$%^!@#K";
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
    },
    email_msg: {
        base: "email must be string",
        required: "email is required",
        pattern: "Please enter valid email"
    },
    manager_team_icon_url_msg: {
        base: "Manager team icon URL must be string",
        required: "Manager team icon URL is required",
    },
    manager_team_name_msg: {
        base: "Manager team name must be string",
        required: "Manager team name is required",
    }
};
exports.notificationmsg = {};
exports.EMPLOYER_FREE_TRIAL_DURATION = parseInt(process.env.EMPLOYER_FREE_TRIAL_DURATION) || 14;
exports.USER_ROLE = {
    super_admin: 1,
    sub_admin: 2,
    employee: 3,
    employer: 4,
    coach: 5,
};
exports.TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS = {
    approved: 1,
    rejected: 2,
    requested: 3
};
exports.EMPLOYER_SUBSCRIPTION_PLAN_STATUS = {
    inactive: 0,
    active: 1,
    cancelled: 2,
    exhausted: 3,
};
exports.NOTIFICATION_TYPE = {
    other: 0,
    assign_new_goal: 1,
    goal_complete_request: 2,
    rating: 3,
    message: 4,
    audio_chat: 5,
    video_chat: 6,
    goal_accept: 7,
    goal_reject: 8,
    chat_disconnect: 9,
    audio_chat_missed: 10,
    video_chat_missed: 11,
    achievement_post: 12,
    achievement_like: 13,
    achievement_highfive: 14,
    achievement_comment: 15,
    group_chat: 16,
    expiration_of_free_trial: 17,
    goal_submit_reminder: 18,
    meeting_about_to_end: 19,
    update_meeting_duration: 20,
    new_coaching_session_request: 21,
    session_accepted: 22,
    session_rejected: 23,
    cancel_session: 24,
    session_reassigned: 25,
    session_with_in_10_min: 26,
    session_completed: 27,
};
exports.BLUETANGO_NOTIFICATION_TYPE = {
    text_chat: 1
};
exports.NOTIFICATION_RECIEVER_TYPE = {
    employee: 1,
    employer: 2,
    coach: 3,
    admin: 4,
};
exports.CHAT_USER_TYPE = {
    employee: 1,
    coach: 2,
    BT_admin: 3
};
exports.BLUETANGO_CHAT_USER_TYPE = {
    admin: 1,
    coach: 2,
};
exports.STATUS = {
    inactive: 0,
    active: 1,
    deleted: 2,
};
exports.PRIMARY_GOAL = {
    no: 0,
    yes: 1,
};
exports.CHAT_ROOM_TYPE = {
    employee: 0,
    coach: 1,
    group: 2,
    BT_admin: 3
};
exports.EMPLOYER_SUBSCRIPTION_TYPE = {
    free: 0,
    paid: 1,
    no_plan: 2,
};
exports.EMPLOYER_FREE_TRIAL_STATUS = {
    yet_to_start: 0,
    on_going: 1,
    over: 2,
};
exports.CHAT_DISCONNECT_TYPE = {
    disconnected: 1,
    missed: 2,
};
exports.FEEDBACK_TYPE = {
    employee: 1,
    employer: 2,
    coach: 3,
    other: 4,
};
exports.SECRETS = {
    PAYPAL_SECRETS: {
        client_id: process.env.PAYPAL_CLIENT_ID,
        client_secret: process.env.PAYPAL_CLIENT_SECRET,
        environment: process.env.PAYPAL_ENVIRONMENT,
    },
    BRAINTREE_SECRETS: {
        merchant_id: process.env.BRAINTREE_MERCHANT_ID,
        public_key: process.env.BRAINTREE_PUBLIC_KEY,
        private_key: process.env.BRAINTREE_PRIVATE_KEY,
        access_token: process.env.BRAINTREE_ACCESS_TOKEN
    },
    ZOOM_SECRETS: {
        jwt_token: process.env.ZOOM_JWT_TOKEN,
    }
};
exports.TIME_ZONE = process.env.TIME_ZONE;
exports.URLS = {
    ZOOM_URLS: {
        base_url: process.env.ZOOM_BASE_URL
    }
};
exports.IS_PAGINATION = {
    no: 0,
    yes: 1,
};
exports.EMPLOYEE_COACH_SESSION_CANCELLED_BY = {
    not_cancelled: 0,
    coach: 1,
    employee: 2,
};
exports.EMPLOYEE_COACH_SESSION_TYPE = {
    free: 1,
    paid: 2,
};
exports.EMPLOYEE_COACH_SESSION_STATUS = {
    pending: 1,
    accepted: 2,
    rejected: 3,
    cancelled: 4,
    completed: 5,
};
exports.COACH_SCHEDULE_STATUS = {
    available: 1,
    booked: 2,
    passed: 3,
    unavailable: 4,
};
exports.COACH_SCHEDULE_TYPE = {
    does_not_repeat: 1,
    daily: 2,
    weekly: 3,
    every_week_day: 4,
    custom: 5,
};
exports.COACH_SCHEDULE_DAY = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
};
exports.COACH_SCHEDULE_SLOT_DELETE_TYPE = {
    individual: 1,
    group: 2,
};
exports.COACH_SCHEDULE_SLOT_GROUP_DELETE_TYPE = {
    date: 1,
    time: 2,
};
exports.ZOOM_USER_TYPE = {
    coach: 1,
    employee: 2,
};
exports.CONTACT_TYPE = {
    employee: 1,
    employer: 2,
    coach: 3,
};
exports.ADMIN_PERMISSION = {
    add: 1,
    update: 2,
    view: 3,
    delete: 4
};
exports.COACH_APP_ID = {
    BX: 1,
    BT: 2,
};
exports.TIME_CAPTURE_TYPE = {
    available: 1,
    unavailable: 2,
    previewed: 3
};
exports.DEFAAULT_START_END_TIME = {
    start_time: "06:00",
    end_time: "24:00",
};
exports.SESSION_ACTION = {
    pending: 1,
    declined: 2,
    expired: 3,
    reassigned: 4,
    accepted: 5
};
exports.ACTION_BY = {
    pending: 0,
    coach: 1,
    system: 2,
    admin: 3
};
//# sourceMappingURL=constants.js.map