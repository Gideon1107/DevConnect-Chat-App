export const HOST = import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTES = "api/auth";
export const USER_ROUTES = "api/user";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/register`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GOOGLE_LOGIN_ROUTE = `${AUTH_ROUTES}/google`;
export const CHECK_AUTH_ROUTE = `${AUTH_ROUTES}/check`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;
export const GETUSER_ROUTE = `${USER_ROUTES}/profile`

