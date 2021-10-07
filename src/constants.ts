import * as dotenv from "dotenv";
dotenv.config();

export const MESSAGES = {
  phone_already_registered: "An account with given phone number already exists",
  email_already_registered: "An account with given email already exists",
  email_phone_already_registered: "An account with given email or phone already exists",
  employee_code_already_registered:"An account with given employee code already exists",
  invalid_password: "Incorrect Password",
  invalid_old_password: "Incorrect old password",
  invalid_email: "Incorrect Email",
  deactivate_account:'Your account has been de-activated by Admin. Please contact to admin',
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
  reset_password_success :"password reset successfully",
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
  subAdmin_added: "Sub admin added successfully",
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
  self_chat:"You can not chat with yourself",
  advisor_added: "Advisor added",
  advisor_fetched: "Advisor list fetched",
  advisor_updated: "Advisor updated",
  invalid_advisor: "Invalid advisor",
  only_manager_chat: "You can initiate chat with your manager only",
  only_manager_or_coach_chat: "You can initiate chat either with your manager or with a coach",
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
  goal_not_assigned:`This goal is not assigned to you`,
  goal_assign_not_found:`No goal assined found with this id`,
  four_goal_assign_not_found:`Either at least one of these four goal assign IDs does not match the goals assigned to this employee or at least one of these goal assign IDs does not exist`,
  only_four_primary_goals_are_allowed:`Exactly 4 goals can be marked as primary at a time. No less no more`,
  attribute_already_added:`An attribute with the same name/label already exist.`,
  attribute_not_found:`Either no attribute exist with this id or it does not belogs to current employer`,
  no_feedback:`No feedback found`,
  no_coach_specialization_category:`No specialization category found`,
  coach_specialization_category_already_exist:`A coach specialization category with the same name already exist.`,
  no_employee_rank:`No employee rank found`,
  employee_rank_already_exist:`A employee rank with the same name already exist.`,
  coach_specialization_category_delete_error:`If a coach belongs to a particular coach specialization category then that coach specialization category cannot be deleted.`,
  employee_rank_delete_employee_error:`If an employee belongs to a particular employee rank then that employee rank cannot be deleted.`,
  employee_rank_delete_coach_error:`If a coach belongs to a particular employee rank then that employee rank cannot be deleted.`,
  delete_success:`Deleted Successfully`,
  no_session:`No session found`,
  coach_schedule_day_required:`Day is required if slot type is weekly`,
  coach_schedule_custom_dates_required:`Custom dates is/are required if slot type is custom`,
  coach_schedule_already_exist:`This schedule time has some conflicts with existing slot(s).`,
  no_coach_schedule:`No slot found`,
  slot_id_required:`Slot id is required in case of individual delete`,
  slot_date_group_id_required:`Slot date group id is required in case of date group delete`,
  slot_time_group_id_required:`Slot time group id is required in case of time group delete`,
}


export const HOST_URL = process.env.HOST_URL

export const code = {
  error_code: 400
}

export const ROUTE_PREFIX = {
  NEW_BASE_PATH: "/api/",
};

export const mobile_otp_message = 'Your one time password is ';
export const SECRET_KEY = "A!@#$%^";
export const ADMIN_SECRET_KEY = "S$%^!@#K";
export const EMAIL_SECRET_KEY = "S$%^K@*S";
export const EMPLOYEE_SECRET_KEY = "EE$%^!@#K"
export const EMPLOYER_SECRET_KEY = "ER$%^!@#K"
export const COACH_SECRET_KEY = "ER$%^!@#K"
export const FORGOT_PASSWORD_SECRET_KEY = "FORKEY$%^!@#K"
export const defaultServerResponse = {
  status: 400,
  success: false,
  message: '',
  body: {}
}
export const otp_expiry_time = 30*60*1000;
export const OFFSET_LIMIT = 10;
export const CUSTOM_JOI_MESSAGE = {
  password_msg : {
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
}
export const notificationmsg = {
};

export const EMPLOYER_FREE_TRIAL_DURATION= parseInt(process.env.EMPLOYER_FREE_TRIAL_DURATION) || 14;

export const USER_ROLE = {
  super_admin: 1,
  sub_admin: 2,
  employee: 3,
  employer: 4,
  coach:5,
}

export const TEAM_GOAL_ASSIGN_COMPLETED_BY_EMPLOYEE_STATUS = {
  approved: 1,
  rejected: 2,
  requested: 3
}

export const EMPLOYER_SUBSCRIPTION_PLAN_STATUS = {
  inactive:0,
  active: 1,
  cancelled: 2,
  exhausted: 3,  
}

export const NOTIFICATION_TYPE = {
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
  group_chat:16,
  expiration_of_free_trial: 17,
  goal_submit_reminder:18,
  
}

export const NOTIFICATION_RECIEVER_TYPE = {
  employee: 1,
  employer: 2,
  coach: 3,
  admin:4,
}

export const STATUS = {
  inactive: 0,
  active: 1,
  deleted: 2,
}

export const PRIMARY_GOAL = {
  no: 0,
  yes: 1,
}

export const CHAT_ROOM_TYPE = {
  employee: 0,
  coach: 1,
  group:2,
}

export const EMPLOYER_SUBSCRIPTION_TYPE = {
  free: 0,
  paid: 1,
  no_plan:2,
}

export const EMPLOYER_FREE_TRIAL_STATUS = {
  yet_to_start: 0,
  on_going: 1,
  over: 2,
}

export const CHAT_DISCONNECT_TYPE= {
  disconnected: 1,
  missed: 2,
}

export const FEEDBACK_TYPE = {
  employee: 1,
  employer: 2,
  coach: 3,
  other: 4,
}

export const SECRETS = {
  PAYPAL_SECRETS: {
    client_id:process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
    environment: process.env.PAYPAL_ENVIRONMENT,
  },
  BRAINTREE_SECRETS: {
    merchant_id: process.env.BRAINTREE_MERCHANT_ID,
    public_key: process.env.BRAINTREE_PUBLIC_KEY,
    private_key: process.env.BRAINTREE_PRIVATE_KEY,
    access_token:process.env.BRAINTREE_ACCESS_TOKEN
  }
}

export const IS_PAGINATION={
  no:0,
  yes:1,
}

export const EMPLOYEE_COACH_SESSION_CANCELLED_BY={
  not_cancelled:0,
  coach:1,
  employee:2,
}

export const EMPLOYEE_COACH_SESSION_TYPE={
  free:1,
  paid:2,
}

export const EMPLOYEE_COACH_SESSION_STATUS={
  active:1,
  ongoing:2,
  completed:3,
  cancelled:4,
}

export const COACH_SCHEDULE_STATUS={
  available:1,
  in_process:2,
  booked:3,
  passed:4,
}

export const COACH_SCHEDULE_TYPE={
  does_not_repeat:1,
  daily:2,
  weekly:3,
  every_week_day:4,
  custom:5,
}

export const COACH_SCHEDULE_DAY={
  sunday:0,
  monday:1,
  tuesday:2,
  wednesday:3,
  thursday:4,
  friday:5,
  saturday:6, 
}

export const COACH_SCHEDULE_SLOT_DELETE_TYPE={
  individual:1,
  group:2,
}

export const COACH_SCHEDULE_SLOT_GROUP_DELETE_TYPE={
  date:1,
  time:2,
}