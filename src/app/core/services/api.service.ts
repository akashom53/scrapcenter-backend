import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { Observable, from } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: environment.apiUrl,
            timeout: 10000,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    get<T>(url: string): Observable<T> {
        return from(
            this.axiosInstance.get<T>(url)
                .then((response: AxiosResponse<T>) => response.data)
                .catch((error: AxiosError) => {
                    throw new HttpErrorResponse({
                        error: error.response?.data,
                        status: error.response?.status
                    });
                })
        );
    }

    post<T>(url: string, data: any): Observable<T> {
        return from(
            this.axiosInstance.post<T>(url, data)
                .then((response: AxiosResponse<T>) => response.data)
                .catch(this.handleError)
        );
    }

    put<T>(url: string, data: any): Observable<T> {
        return from(
            this.axiosInstance.put<T>(url, data)
                .then((response: AxiosResponse<T>) => response.data)
                .catch(this.handleError)
        );
    }

    patch<T>(url: string, data: any): Observable<T> {
        return from(
            this.axiosInstance.patch<T>(url, data)
                .then((response: AxiosResponse<T>) => response.data)
                .catch(this.handleError)
        );
    }

    delete<T>(url: string, data?: any): Observable<T> {
        return from(
            this.axiosInstance.delete<T>(url, { data })
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