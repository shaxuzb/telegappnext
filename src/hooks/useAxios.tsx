import { useEffect, useRef } from "react";
import axios from "axios";

const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const useAxios = () => {
  const hasSentNotification = useRef(false); // To track if a notification has been sent
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${user.token}`;
        }
        config.headers["Content-Type"] = "application/x-www-form-urlencoded";
        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error?.response?.status === 401 && !hasSentNotification.current) {
          //   logout();

          hasSentNotification.current = true;
        }
        if (error?.code === "ERR_NETWORK" && !hasSentNotification.current) {
          hasSentNotification.current = true; // Mark notification as sent
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return axiosPrivate;
};

export default useAxios;
