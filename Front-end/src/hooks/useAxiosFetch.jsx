import React, { useEffect } from 'react';
import axios from "axios";

// const useAxiosFetch = () => {
const useAxiosFetch = () => {
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:5000',
    });
    
    //interceptors
    useEffect(() => {
        //request interceptors
        const requestInterceptor = axiosInstance.interceptors.request.use( (config)=> {
            return config;
        // }, function (error) {
        //     return Promise.reject(error);
        });

        //response Interceptor
        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response)=> response,
      (error) => {
        throw error;
        });

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        }
    }, [axiosInstance])

  return axiosInstance;
}


export default useAxiosFetch