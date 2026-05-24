import axios from "axios";

const authApiClient = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
});

// #region agent log
authApiClient.interceptors.request.use((config) => {
  fetch('http://127.0.0.1:7372/ingest/6afc323c-cc4e-49d5-ac76-c5812cce471f',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c6bb02'},body:JSON.stringify({sessionId:'c6bb02',location:'AuthApiService.jsx:request',message:'axios request',data:{method:config.method,url:config.baseURL+config.url},timestamp:Date.now(),hypothesisId:'H-B',runId:'pre-fix'})}).catch(()=>{});
  return config;
});
authApiClient.interceptors.response.use(
  (response) => {
    fetch('http://127.0.0.1:7372/ingest/6afc323c-cc4e-49d5-ac76-c5812cce471f',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c6bb02'},body:JSON.stringify({sessionId:'c6bb02',location:'AuthApiService.jsx:response',message:'axios response',data:{status:response.status,url:response.config?.url},timestamp:Date.now(),hypothesisId:'H-B,H-E',runId:'pre-fix'})}).catch(()=>{});
    return response;
  },
  (error) => {
    fetch('http://127.0.0.1:7372/ingest/6afc323c-cc4e-49d5-ac76-c5812cce471f',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c6bb02'},body:JSON.stringify({sessionId:'c6bb02',location:'AuthApiService.jsx:responseError',message:'axios error',data:{status:error?.response?.status,code:error?.code,message:error?.message},timestamp:Date.now(),hypothesisId:'H-B,H-C',runId:'pre-fix'})}).catch(()=>{});
    return Promise.reject(error);
  }
);
// #endregion

// Combine username and password into a single object for loginApi
const loginCredentials = (username, password) => ({ username, password });

export const registerApi = (user) => authApiClient.post('/register', user);

export const loginApi = (username, password) =>
  authApiClient.post('/login', loginCredentials(username, password));

export const saveLoggedUser = (userId, username, role) => {
  sessionStorage.setItem('activeUserId', userId);
  sessionStorage.setItem('authenticatedUser', username);
  sessionStorage.setItem('role', role);
};

export const storeBasicAuth = (basicAuth) => localStorage.setItem('auth', basicAuth);
export const getBasicAuth = () => localStorage.getItem('auth');

export const isUserLoggedIn = () => !!sessionStorage.getItem('authenticatedUser'); // Leverage double negation for concise check

export const getLoggedInUserId = () => sessionStorage.getItem('activeUserId');
export const getLoggedInUser = () => sessionStorage.getItem('authenticatedUser');

export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
};

export const isAdminUser = () => sessionStorage.getItem('role') === 'ROLE_ADMIN'; // Strict comparison for role check
