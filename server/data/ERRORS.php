<?php
/**
 * @apiDefine INVALID_CREDENTIALS
 * @apiError {String} INVALID_CREDENTIALS Login credentials does not match.
 */
/**
 * @apiDefine SESSION_EXISTS
 * @apiError {String} SESSION_EXISTS The session already exists.
 */
/**
 * @apiDefine USER_EXISTS
 * @apiError {String} USER_EXISTS The user already exists.
 */
/**
 * @apiDefine TAG_EXISTS
 * @apiError {String} TAG_EXISTS The tag already exists.
 */
/**
 * @apiDefine NO_PERMISSION
 * @apiError {String} NO_PERMISSION You have no permission to perform this operation.
 */
/**
 * @apiDefine INVALID_TITLE
 * @apiError {String} INVALID_TITLE The title is invalid, probably too short.
 */
/**
 * @apiDefine INVALID_CONTENT
 * @apiError {String} INVALID_CONTENT The content is invalid, probably to short.
 */
/**
 * @apiDefine INVALID_EMAIL
 * @apiError {String} INVALID_EMAIL The email is invalid or already exists.
 */
/**
 * @apiDefine INVALID_PASSWORD
 * @apiError {String} INVALID_PASSWORD The password is invalid, probably too short.
 */
/**
 * @apiDefine INVALID_NAME
 * @apiError {String} INVALID_NAME The name is invalid, probably too short.
 */
/**
 * @apiDefine INVALID_DESCRIPTION
 * @apiError {String} INVALID_DESCRIPTION The description is invalid.
 */
/**
 * @apiDefine INVALID_SETTING
 * @apiError {String} INVALID_SETTING The setting are invalid.
 */
/**
 * @apiDefine INVALID_DEPARTMENT
 * @apiError {String} INVALID_DEPARTMENT The dapartment is invalid, probably too short.
 */
/**
 * @apiDefine INVALID_TICKET
 * @apiError {String} INVALID_TICKET The ticket is invalid.
 */
/**
 * @apiDefine INVALID_TAG
 * @apiError {String} INVALID_TAG The tag is invalid.
 */
/**
 * @apiDefine INVALID_OLD_PASSWORD
 * @apiError {String} INVALID_OLD_PASSWORD The old password is invalid.
 */
/**
 * @apiDefine INVALID_CAPTCHA
 * @apiError {String} INVALID_CAPTCHA The captcha is invalid.
 */
/**
 * @apiDefine INVALID_TICKET_EVENT
 * @apiError {String} INVALID_TICKET_EVENT The ticket event is invalid.
 */
/**
 * @apiDefine INVALID_LANGUAGE
 * @apiError {String} INVALID_LANGUAGE The language is invalid.
 */
/**
 * @apiDefine TICKET_ALREADY_ASSIGNED
 * @apiError {String} TICKET_ALREADY_ASSIGNED The ticket is already assigned.
 */
/**
 * @apiDefine INVALID_PAGE
 * @apiError {String} INVALID_PAGE The page is invalid.
 */
/**
 * @apiDefine INVALID_QUERY
 * @apiError {String} INVALID_QUERY The query is invalid.
 */
/**
 * @apiDefine INVALID_BLACK_LIST
 * @apiError {String} INVALID_BLACK_LIST The black list is invalid.
 */
/**
 * @apiDefine INVALID_LIST
 * @apiError {String} INVALID_LIST The list is invalid.
 */
/**
 * @apiDefine INVALID_TAG_FILTER
 * @apiError {String} INVALID_TAG_FILTER The tag filter is invalid.
 */
/**
 * @apiDefine INVALID_CLOSED_FILTER
 * @apiError {String} INVALID_CLOSED_FILTER The closed filter is invalid.
 */
/**
 * @apiDefine INVALID_UNREAD_STAFF_FILTER
 * @apiError {String} INVALID_UNREAD_STAFF_FILTER The unread-staff filter is invalid.
 */
/**
 * @apiDefine INVALID_DATE_RANGE_FILTER
 * @apiError {String} INVALID_DATE_RANGE_FILTER The date-range filter is invalid.
 */
/**
 * @apiDefine INVALID_DEPARTMENT_FILTER
 * @apiError {String} INVALID_DEPARTMENT_FILTER The department filter is invalid.
 */
/**
 * @apiDefine INVALID_AUTHOR_FILTER
 * @apiError {String} INVALID_AUTHOR_FILTER The author filter is invalid.
 */
/**
 * @apiDefine INVALID_OWNER_FILTER
 * @apiError {String} INVALID_OWNER_FILTER The owner filter is invalid.
 */
/**
 * @apiDefine INVALID_ASSIGNED_FILTER
 * @apiError {String} INVALID_ASSIGNED_FILTER The assigned filter is invalid.
 */
/**
 * @apiDefine INVALID_QUERY_FILTER
 * @apiError {String} INVALID_QUERY_FILTER The query filter is invalid.
 */
/**
 * @apiDefine INVALID_ORDER_BY
 * @apiError {String} INVALID_ORDER_BY The order-by is invalid.
 */
/**
 * @apiDefine INVALID_TOPIC
 * @apiError {String} INVALID_TOPIC The topic is invalid.
 */
/**
 * @apiDefine INVALID_SEARCH
 * @apiError {String} INVALID_SEARCH The search is invalid.
 */
/**
 * @apiDefine INVALID_ORDER
 * @apiError {String} INVALID_ORDER The order is invalid.
 */
/**
 * @apiDefine INVALID_USER
 * @apiError {String} INVALID_USER The user is invalid.
 */
/**
 * @apiDefine ALREADY_BANNED
 * @apiError {String} ALREADY_BANNED It's already banned.
 */
/**
 * @apiDefine INVALID_LEVEL
 * @apiError {String} INVALID_LEVEL The level is invalid.
 */
/**
 * @apiDefine ALREADY_A_STAFF
 * @apiError {String} ALREADY_A_STAFF It's already a staff.
 */
/**
 * @apiDefine INVALID_STAFF
 * @apiError {String} INVALID_STAFF The staff is invalid.
 */
/**
 * @apiDefine SAME_DEPARTMENT
 * @apiError {String} SAME_DEPARTMENT It's the same department.
 */
/**
 * @apiDefine INVALID_TOKEN
 * @apiError {String} INVALID_TOKEN The token is invalid.
 */
/**
 * @apiDefine UNVERIFIED_USER
 * @apiError {String} UNVERIFIED_USER The user is not verified.
 */
/**
 * @apiDefine INVALID_TEMPLATE
 * @apiError {String} INVALID_TEMPLATE The template is invalid.
 */
/**
 * @apiDefine INVALID_SUBJECT
 * @apiError {String} INVALID_SUBJECT The subject is invalid.
 */
/**
 * @apiDefine INVALID_BODY
 * @apiError {String} INVALID_BODY The body is invalid.
 */
/**
 * @apiDefine SYSTEM_USER_IS_ALREADY_DISABLED
 * @apiError {String} SYSTEM_USER_IS_ALREADY_DISABLED The system user is already disabled.
 */
/**
 * @apiDefine SYSTEM_USER_IS_ALREADY_ENABLED
 * @apiError {String} SYSTEM_USER_IS_ALREADY_ENABLED The system user is already enabled.
 */
/**
 * @apiDefine INVALID_PERIOD
 * @apiError {String} INVALID_PERIOD The period is invalid.
 */
/**
 * @apiDefine NAME_ALREADY_USED
 * @apiError {String} NAME_ALREADY_USED The name is already used.
 */
/**
 * @apiDefine INVALID_FILE
 * @apiError {String} INVALID_FILE The file is invalid or max size exceeded.
 */
/**
 * @apiDefine INVALID_DEFAULT_DEPARTMENT
 * @apiError {String} INVALID_DEFAULT_DEPARTMENT The default department id is invalid.
 */
/**
 * @apiDefine CAN_NOT_DELETE_DEFAULT_DEPARTMENT
 * @apiError {String} CAN_NOT_DELETE_DEFAULT_DEPARTMENT The default department can not be deleted.
 */
/**
 * @apiDefine DATABASE_CONNECTION
 * @apiError {String} DATABASE_CONNECTION It's a database connection error.
 */
/**
 * @apiDefine DATABASE_CREATION
 * @apiError {String} DATABASE_CREATION It's a database creation error.
 */
/**
 * @apiDefine SMTP_CONNECTION
 * @apiError {String} SMTP_CONNECTION Could not connect with SMTP server.
 */
/**
 * @apiDefine ALREADY_DISABLED
 * @apiError {String} ALREADY_DISABLED User is already disabled
 */
/**
 * @apiDefine ALREADY_ENABLED
 * @apiError {String} ALREADY_ENABLED User is already enabled
 */
/**
 * @apiDefine USER_DISABLED
 * @apiError {String} USER_DISABLED User is disabled
 */
/**
 * @apiDefine INVALID_TEXT_1
 * @apiError {String} INVALID_TEXT_1 text1 of mail template has an invalid syntax or missing variables
 */
/**
 * @apiDefine INVALID_TEXT_2
 * @apiError {String} INVALID_TEXT_2 text2 of mail template has an invalid syntax or missing variables
 */
/**
 * @apiDefine INVALID_TEXT_3
 * @apiError {String} INVALID_TEXT_3 text3 of mail template has an invalid syntax or missing variables
 */
/**
 * @apiDefine DEPARTMENT_PRIVATE_TICKETS
 * @apiError {String} DEPARTMENT_PRIVATE_TICKETS There are tickets for in department created by non-staff and it can't be private
 */
/**
 * @apiDefine DEFAULT_DEPARTMENT_CAN_NOT_BE_PRIVATE
 * @apiError {String} DEFAULT_DEPARTMENT_CAN_NOT_BE_PRIVATE Default Department can not be private
 */
/**
 * @apiDefine SUPERVISOR_CAN_NOT_SUPERVISE_HIMSELF
 * @apiError {String} SUPERVISOR_CAN_NOT_SUPERVISE_HIMSELF The supervisor cannot select himself
 */
/**
 * @apiDefine EMAIL_POLLING
 * @apiError {String} EMAIL_POLLING Email polling was unsuccesful
 */
/**
 * @apiDefine IMAP_CONNECTION
 * @apiError {String} IMAP_CONNECTION Imap connection was unsuccesfull
 */
/**
 * @apiDefine CUSTOM_FIELD_ALREADY_EXISTS
 * @apiError {String} CUSTOM_FIELD_ALREADY_EXISTS Custom field already exists
 */
/**
 * @apiDefine INVALID_CUSTOM_FIELD
 * @apiError {String} INVALID_CUSTOM_FIELD Custom field id is invalid
 */
/**
 * @apiDefine INVALID_CUSTOM_FIELD_TYPE
 * @apiError {String} INVALID_CUSTOM_FIELD_TYPE The type is invalid
 */
/**
 * @apiDefine INVALID_CUSTOM_FIELD_OPTIONS
 * @apiError {String} INVALID_CUSTOM_FIELD_OPTIONS Options are not a json array
 */
/**
 * @apiDefine INVALID_CUSTOM_FIELD_OPTION
 * @apiError {String} INVALID_CUSTOM_FIELD_OPTION Option is not in the list of possibles
 */
/**
 * @apiDefine UNAVAILABLE_STATS
 * @apiError {String} UNAVAILABLE_STATS Stats are currently unavailable
 */
/**
 * @apiDefine INVALID_COLOR
 * @apiError {String} INVALID_COLOR The color should be in hexadecimal, preceded by a '#'
 */
/**
 * @apiDefine INVALID_API_KEY_TYPE
 * @apiError {String} INVALID_API_KEY_TYPE Api key type is not one of the availables
 */
/**
 * @apiDefine MANDATORY_LOGIN_IS_DESACTIVATED
 * @apiError {String} MANDATORY_LOGIN_IS_DESACTIVATED Mandatory login is disactivated
 */
/**
 * @apiDefine REGISTRATION_IS_DESACTIVATED
 * @apiError {String} REGISTRATION_IS_DESACTIVATED Registration is disactivated
 */
/**
 * @apiDefine INVALID_SUPERVISED_USERS
 * @apiError {String} INVALID_SUPERVISED_USERS supervised users are invalid
 */

/**
 * @apiDefine INVALID_COMPANY
 * @apiError {String} INVALID_COMPANY company is invalid
 */
class ERRORS
{
    public const INVALID_CREDENTIALS = 'INVALID_CREDENTIALS';
    public const SESSION_EXISTS = 'SESSION_EXISTS';
    public const USER_EXISTS = 'USER_EXISTS';
    public const TAG_EXISTS = 'TAG_EXISTS';
    public const NO_PERMISSION = 'NO_PERMISSION';
    public const INVALID_TITLE = 'INVALID_TITLE';
    public const INVALID_CONTENT = 'INVALID_CONTENT';
    public const INVALID_EMAIL = 'INVALID_EMAIL';
    public const INVALID_PASSWORD = 'INVALID_PASSWORD';
    public const INVALID_NAME = 'INVALID_NAME';
    public const INVALID_DESCRIPTION = 'INVALID_DESCRIPTION';
    public const INVALID_SETTING = 'INVALID_SETTING';
    public const INVALID_DEPARTMENT = 'INVALID_DEPARTMENT';
    public const INVALID_TICKET = 'INVALID_TICKET';
    public const INVALID_TAG = 'INVALID_TAG';
    public const INVALID_OLD_PASSWORD = 'INVALID_OLD_PASSWORD';
    public const INVALID_CAPTCHA = 'INVALID_CAPTCHA';
    public const INVALID_TICKET_EVENT = 'INVALID_TICKET_EVENT';
    public const INVALID_LANGUAGE = 'INVALID_LANGUAGE';
    public const INVALID_SUPPORTED_LANGUAGES = 'INVALID_SUPPORTED_LANGUAGES';
    public const TICKET_ALREADY_ASSIGNED = 'TICKET_ALREADY_ASSIGNED';
    public const INVALID_PAGE = 'INVALID_PAGE';
    public const INVALID_QUERY = 'INVALID_QUERY';
    public const INVALID_LIST = 'INVALID_LIST';
    public const INVALID_BLACK_LIST = 'INVALID_BLACK_LIST';
    public const INVALID_TAG_FILTER = 'INVALID_TAG_FILTER';
    public const INVALID_CLOSED_FILTER = 'INVALID_CLOSED_FILTER';
    public const INVALID_UNREAD_STAFF_FILTER = 'INVALID_UNREAD_STAFF_FILTER';
    public const INVALID_DATE_RANGE_FILTER = 'INVALID_DATE_RANGE_FILTER';
    public const INVALID_DEPARTMENT_FILTER = 'INVALID_DEPARTMENT_FILTER';
    public const INVALID_AUTHOR_FILTER = 'INVALID_AUTHOR_FILTER';
    public const INVALID_OWNER_FILTER = 'INVALID_OWNER_FILTER';
    public const INVALID_ASSIGNED_FILTER = 'INVALID_ASSIGNED_FILTER';
    public const INVALID_QUERY_FILTER = 'INVALID_QUERY_FILTER';
    public const INVALID_ORDER_BY = 'INVALID_ORDER_BY';
    public const INVALID_TOPIC = 'INVALID_TOPIC';
    public const INVALID_SEARCH = 'INVALID_SEARCH';
    public const INVALID_ORDER = 'INVALID_ORDER';
    public const INVALID_USER = 'INVALID_USER';
    public const ALREADY_BANNED = 'ALREADY_BANNED';
    public const INVALID_LEVEL = 'INVALID_LEVEL';
    public const ALREADY_A_STAFF = 'ALREADY_A_STAFF';
    public const INVALID_STAFF = 'INVALID_STAFF';
    public const SAME_DEPARTMENT = 'SAME_DEPARTMENT';
    public const INVALID_TOKEN = 'INVALID_TOKEN';
    public const UNVERIFIED_USER = 'UNVERIFIED_USER';
    public const INVALID_TEMPLATE = 'INVALID_TEMPLATE';
    public const INVALID_SUBJECT = 'INVALID_SUBJECT';
    public const INVALID_BODY = 'INVALID_BODY';
    public const SYSTEM_USER_IS_ALREADY_DISABLED = 'SYSTEM_USER_IS_ALREADY_DISABLED';
    public const SYSTEM_USER_IS_ALREADY_ENABLED = 'SYSTEM_USER_IS_ALREADY_ENABLED';
    public const INVALID_PERIOD = 'INVALID_PERIOD';
    public const NAME_ALREADY_USED = 'NAME_ALREADY_USED';
    public const INVALID_FILE = 'INVALID_FILE';
    public const INVALID_DEFAULT_DEPARTMENT = 'INVALID_DEFAULT_DEPARTMENT';
    public const CAN_NOT_DELETE_DEFAULT_DEPARTMENT = 'CAN_NOT_DELETE_DEFAULT_DEPARTMENT';
    public const DATABASE_CONNECTION = 'DATABASE_CONNECTION';
    public const DATABASE_CREATION = 'DATABASE_CREATION';
    public const SMTP_CONNECTION = 'SMTP_CONNECTION';
    public const IMAP_CONNECTION = 'IMAP_CONNECTION';
    public const ALREADY_DISABLED = 'ALREADY_DISABLED';
    public const ALREADY_ENABLED = 'ALREADY_ENABLED';
    public const USER_DISABLED = 'USER_DISABLED';
    public const INVALID_TEXT_1 = 'INVALID_TEXT_1';
    public const INVALID_TEXT_2 = 'INVALID_TEXT_2';
    public const INVALID_TEXT_3 = 'INVALID_TEXT_3';
    public const DEPARTMENT_PRIVATE_TICKETS = 'DEPARTMENT_PRIVATE_TICKETS';
    public const DEFAULT_DEPARTMENT_CAN_NOT_BE_PRIVATE = 'DEFAULT_DEPARTMENT_CAN_NOT_BE_PRIVATE';
    public const SUPERVISOR_CAN_NOT_SUPERVISE_HIMSELF = 'SUPERVISOR_CAN_NOT_SUPERVISE_HIMSELF';
    public const EMAIL_POLLING = 'EMAIL_POLLING';
    public const CUSTOM_FIELD_ALREADY_EXISTS = 'CUSTOM_FIELD_ALREADY_EXISTS';
    public const INVALID_CUSTOM_FIELD = 'INVALID_CUSTOM_FIELD';
    public const INVALID_CUSTOM_FIELD_TYPE = 'INVALID_CUSTOM_FIELD_TYPE';
    public const INVALID_CUSTOM_FIELD_OPTIONS = 'INVALID_CUSTOM_FIELD_OPTIONS';
    public const INVALID_CUSTOM_FIELD_OPTION = 'INVALID_CUSTOM_FIELD_OPTION';
    public const UNAVAILABLE_STATS = 'UNAVAILABLE_STATS';
    public const INVALID_COLOR = 'INVALID_COLOR';
    public const INVALID_API_KEY_TYPE = 'INVALID_API_KEY_TYPE';
    public const MANDATORY_LOGIN_IS_DESACTIVATED = 'MANDATORY_LOGIN_IS_DESACTIVATED';
    public const REGISTRATION_IS_DESACTIVATED = 'REGISTRATION_IS_DESACTIVATED';
    public const INVALID_SUPERVISED_USERS = 'INVALID_SUPERVISED_USERS';
    public const INVALID_USER_SEARCH_OPTION = 'INVALID_USER_SEARCH_OPTION';

    public const INVALID_COMPANY = 'INVALID_COMPANY';
    public const COMPANY_EXISTS = 'COMPANY_EXISTS';
    public const INVALID_NIT = 'INVALID_NIT';
    public const INVALID_PHONE = 'INVALID_PHONE';
    public const INVALID_CONTACT_NAME = 'INVALID_CONTACT_NAME';
    public const INVALID_ADMIN_NAME = 'INVALID_ADMIN_NAME';
    public const INVALID_ADMIN_EMAIL = 'INVALID_ADMIN_EMAIL';
    public const USER_ALREADY_ADMIN = 'USER_ALREADY_ADMIN';

    public const USERS_LIMIT_REACHED = 'USERS_LIMIT_REACHED';
    public const COMPANIES_LIMIT_REACHED = 'COMPANIES_LIMIT_REACHED';
    public const DEPARTMENTS_LIMIT_REACHED = 'DEPARTMENTS_LIMIT_REACHED';
    public const STAFF_LIMIT_REACHED = 'STAFF_LIMIT_REACHED';

    public const INVALID_USERS_LIMIT = 'INVALID_USERS_LIMIT';
    public const INVALID_LIMIT = 'INVALID_LIMIT';
    public const INVALID_CONFIG_FILE = 'INVALID_CONFIG_FILE';
    public const INVALID_KEY = 'INVALID_KEY';
    public const INVALID_HOST = 'INVALID_HOST';
    public const INVALID_TIMEZONE = 'INVALID_TIMEZONE';
}
