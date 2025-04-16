export const HOST = import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTES = "api/auth";

export const USER_ROUTES = "api/user";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/register`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GOOGLE_LOGIN_ROUTE = `${AUTH_ROUTES}/google`;
export const CHECK_AUTH_ROUTE = `${AUTH_ROUTES}/check`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const GETUSER_ROUTE = `${USER_ROUTES}/profile`;
export const ADD_PROFILE_PICTURE_ROUTE = `${USER_ROUTES}/update-avatar`
export const DELETE_PROFILE_PICTURE_ROUTE = `${USER_ROUTES}/delete-avatar`
export const UPDATE_PROFILE_ROUTE = `${USER_ROUTES}/update-profile`
export const CHANGE_PASSWORD_ROUTE = `${USER_ROUTES}/change-password`
export const GETALLUSERS_ROUTE = `${USER_ROUTES}/all-users`

export const MESSAGES_ROUTES = "api/messages";
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/get-messages`
export const SEND_FILE_ROUTE = `${MESSAGES_ROUTES}/upload-file`

export const CHAT_LIST_ROUTE = "api/chat"
export const GET_CHAT_LIST_FOR_DM_ROUTE = `${CHAT_LIST_ROUTE}/chat-list-for-dm`
export const GET_ALL_USERS_ROUTE = `${CHAT_LIST_ROUTE}/all-users`

export const GROUP_ROUTES = "api/group"
export const CREATE_GROUP_ROUTE = `${GROUP_ROUTES}/create-group`
export const GET_USER_GROUPS_ROUTE = `${GROUP_ROUTES}/get-user-groups`
export const GET_GROUP_MEMBERS_ROUTE = `${GROUP_ROUTES}/get-group-members`
export const GET_GROUP_ADMIN_ROUTE = `${GROUP_ROUTES}/get-group-admin`
export const EDIT_GROUP_ROUTE = `${GROUP_ROUTES}/edit-group`
export const DELETE_GROUP_ROUTE = `${GROUP_ROUTES}/delete-group`
export const LEAVE_GROUP_ROUTE = `${GROUP_ROUTES}/leave-group`
export const ADD_GROUP_MEMBER_ROUTE = `${GROUP_ROUTES}/add-group-members`
export const REMOVE_GROUP_MEMBER_ROUTE = `${GROUP_ROUTES}/remove-group-member`