import axios from "axios";
import { store } from "../redux/persist/persist";
import { clearCredentials, setCredentials } from "../redux/slices/authSlices";
import { clearPersonData } from "../redux/slices/userSlice";

const BASE_URL = "http://localhost:3000/api/v1";

axios.defaults.withCredentials = true;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

export const apiClient = async ({
  method,
  endpoint,
  data,
  params,
  accessToken,
}) => {
  const isFormData = data instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  const makeRequest = async (token) => {
    const requestHeaders = { ...headers };
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
    const options = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: requestHeaders,
      params,
      data: isFormData ? data : JSON.stringify(data),
    };
    return axios(options);
  };
  try {
    const response = await makeRequest(accessToken);
    return response.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.response.data.message.includes("Unauthorized: Token has expired")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            return makeRequest(token).then((response) => response.data);
          })
          .catch((err) => {
            throw err;
          });
      }
      isRefreshing = true;
      try {
        const { id: userId } = store.getState().auth;
        const response = await axios.post(
          `${BASE_URL}/todo add backend of refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken: newAccessToken } = response.data.data;
        store.dispatch(
          setCredentials({
            accessToken: newAccessToken,
            id: userId,
            _initialized: true,
          })
        );
        processQueue(null, newAccessToken);
        const retryResponse = await makeRequest(newAccessToken);
        return retryResponse.data;
      } catch (refreshError) {
        console.error("Refresh token error:", {
          error: refreshError,
          message: axios.isAxiosError(refreshError)
            ? refreshError.message
            : "Unknown error",
          response: axios.isAxiosError(refreshError)
            ? refreshError.response?.data
            : null,
          status: axios.isAxiosError(refreshError)
            ? refreshError.response?.status
            : null,
        });
        processQueue(refreshError, null);
        store.dispatch(clearCredentials());
        store.dispatch(clearPersonData());
        window.location.href = "/auth/login";
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }
    if (axios.isAxiosError(error)) {
      const errorResponse = error.response?.data;
      const errorDetails = {
        request: {
          method: method,
          url: `${BASE_URL}${endpoint}`,
          headers,
          data: isFormData ? "[FormData]" : data,
          params,
        },
        response: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: errorResponse,
          headers: error.response?.headers,
        },
        error: {
          message: error.message,
          code: error.code,
          name: error.name,
        },
        context: {
          endpoint,
          timestamp: new Date().toISOString(),
        },
      };
      console.error("API Error Details:", errorDetails);
      throw error;
    }
    console.error("Non-Axios Error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : null,
      context: {
        endpoint,
        timestamp: new Date().toISOString(),
      },
    });
    throw error;
  }
};