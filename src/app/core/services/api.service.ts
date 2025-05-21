import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { Observable, from } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private axiosInstance: AxiosInstance;
    private readonly AUTH_TOKEN_KEY = 'access_token';
    private useAuthHeader = true; // Default to using auth headers

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: environment.apiUrl,
            timeout: 10000,
            headers: { 'Content-Type': 'application/json' }
        });

        // Add request interceptor for auth headers
        this.axiosInstance.interceptors.request.use(
            (config) => {
                // Only add auth headers if enabled
                if (this.useAuthHeader) {
                    const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
                    if (token) {
                        // Set Authorization header with token
                        config.headers = config.headers || {};
                        config.headers['Authorization'] = `${token}`;
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    /**
     * Enable or disable authentication headers
     * @param enable Whether to enable auth headers
     */
    setUseAuthHeader(enable: boolean): void {
        this.useAuthHeader = enable;
    }

    /**
     * Create a request config with optional auth header override
     * @param useAuth Override the global auth header setting for this request
     * @returns AxiosRequestConfig with appropriate settings
     */
    private createRequestConfig(useAuth?: boolean): AxiosRequestConfig {
        // If useAuth is explicitly set, use it; otherwise use the instance setting
        const shouldUseAuth = useAuth !== undefined ? useAuth : this.useAuthHeader;

        const config: AxiosRequestConfig = {};

        // If we're explicitly disabling auth for this request when it's globally enabled,
        // we need to set a flag that our interceptor can check
        if (this.useAuthHeader && !shouldUseAuth) {
            config.headers = { 'Skip-Auth': 'true' };
        }

        return config;
    }

    get<T>(url: string, useAuth?: boolean): Observable<T> {
        return from(
            this.axiosInstance.get<T>(url, this.createRequestConfig(useAuth))
                .then((response: AxiosResponse<T>) => response.data)
                .catch((error: AxiosError) => {
                    throw new HttpErrorResponse({
                        error: error.response?.data,
                        status: error.response?.status
                    });
                })
        );
    }

    post<T>(url: string, data: any, useAuth?: boolean): Observable<T> {
        return from(
            this.axiosInstance.post<T>(url, data, this.createRequestConfig(useAuth))
                .then((response: AxiosResponse<T>) => response.data)
                .catch(this.handleError)
        );
    }

    put<T>(url: string, data: any, useAuth?: boolean): Observable<T> {
        return from(
            this.axiosInstance.put<T>(url, data, this.createRequestConfig(useAuth))
                .then((response: AxiosResponse<T>) => response.data)
                .catch(this.handleError)
        );
    }

    patch<T>(url: string, data: any, useAuth?: boolean): Observable<T> {
        return from(
            this.axiosInstance.patch<T>(url, data, this.createRequestConfig(useAuth))
                .then((response: AxiosResponse<T>) => response.data)
                .catch(this.handleError)
        );
    }

    delete<T>(url: string, data?: any, useAuth?: boolean): Observable<T> {
        const config = this.createRequestConfig(useAuth);
        if (data) {
            config.data = data;
        }

        return from(
            this.axiosInstance.delete<T>(url, config)
                .then((response: AxiosResponse<T>) => response.data)
                .catch(this.handleError)
        );
    }

    private handleError(error: AxiosError): never {
        throw new HttpErrorResponse({
            error: error.response?.data,
            status: error.response?.status,
            statusText: error.response?.statusText
        });
    }
}