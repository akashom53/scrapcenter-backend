import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

// Define interfaces based on the Prisma model
export interface Lead {
  id?: number;              // Optional for creation
  createdAt?: Date;         // Optional for creation
  updatedAt?: Date;         // Optional for creation
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleMileage: number;
  vehicleCondition: string;
  vehicleLocation: string;
  additionalNotes?: string; // Optional
  status?: string;          // Optional, defaults to "Pending"
  userId?: number;          // Optional
}

// For create operations
export interface CreateLeadDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleMileage: number;
  vehicleCondition: string;
  vehicleLocation: string;
  additionalNotes?: string;
  userId?: number;
}

// For update operations
export interface UpdateLeadDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleMileage?: number;
  vehicleCondition?: string;
  vehicleLocation?: string;
  additionalNotes?: string;
  status?: string;
  userId?: number;
}

// For filtering/querying leads
export interface LeadFilters {
  status?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  fromDate?: Date;
  toDate?: Date;
  userId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeadsService {
  private readonly LEADS_ENDPOINT = '/leads';

  constructor(private apiService: ApiService) { }

  /**
   * Get all leads with optional filtering
   * @param filters Optional filters to apply to the query
   * @returns Observable with array of leads
   */
  getLeads(filters?: LeadFilters): Observable<Lead[]> {
    // Convert filters to query parameters if provided
    let queryParams = '';
    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Handle date objects
          if (value instanceof Date) {
            params.append(key, value.toISOString());
          } else {
            params.append(key, value.toString());
          }
        }
      });
      queryParams = params.toString() ? `?${params.toString()}` : '';
    }

    return this.apiService.get<Lead[]>(`${this.LEADS_ENDPOINT}${queryParams}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get a single lead by ID
   * @param id Lead ID
   * @returns Observable with lead details
   */
  getLead(id: number): Observable<Lead> {
    return this.apiService.get<Lead>(`${this.LEADS_ENDPOINT}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Create a new lead
   * @param leadData Lead data to create
   * @returns Observable with created lead
   */
  createLead(leadData: CreateLeadDto): Observable<Lead> {
    // Validate required fields
    this.validateLeadData(leadData);

    return this.apiService.post<Lead>(this.LEADS_ENDPOINT, leadData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Update an existing lead
   * @param id Lead ID
   * @param leadData Lead data to update
   * @returns Observable with updated lead
   */
  updateLead(id: number, leadData: UpdateLeadDto): Observable<Lead> {
    return this.apiService.put<Lead>(`${this.LEADS_ENDPOINT}/${id}`, leadData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Update lead status
   * @param id Lead ID
   * @param status New status value
   * @returns Observable with updated lead
   */
  updateLeadStatus(id: number, status: string): Observable<Lead> {
    return this.apiService.patch<Lead>(`${this.LEADS_ENDPOINT}/${id}/status`, { status })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Delete a lead
   * @param id Lead ID
   * @returns Observable with deleted lead or success message
   */
  deleteLead(id: number): Observable<any> {
    return this.apiService.delete(`${this.LEADS_ENDPOINT}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Validate lead data for required fields
   * @param leadData Lead data to validate
   * @throws Error if validation fails
   */
  private validateLeadData(leadData: CreateLeadDto): void {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone',
      'vehicleMake', 'vehicleModel', 'vehicleYear',
      'vehicleMileage', 'vehicleCondition', 'vehicleLocation'
    ];

    const missingFields = requiredFields.filter(field => {
      return !leadData[field as keyof CreateLeadDto];
    });

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(leadData.email)) {
      throw new Error('Please enter a valid email address');
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[0-9\-\+\s()]{10,15}$/;
    if (!phoneRegex.test(leadData.phone)) {
      throw new Error('Please enter a valid phone number');
    }

    // Validate year is reasonable
    const currentYear = new Date().getFullYear();
    if (leadData.vehicleYear < 1900 || leadData.vehicleYear > currentYear + 1) {
      throw new Error(`Vehicle year must be between 1900 and ${currentYear + 1}`);
    }

    // Validate mileage is reasonable
    if (leadData.vehicleMileage < 0 || leadData.vehicleMileage > 1000000) {
      throw new Error('Vehicle mileage must be between 0 and 1,000,000');
    }
  }

  /**
   * Handle API errors
   * @param error HTTP error
   * @returns Observable with error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred with the leads service';

    if (error.error && typeof error.error === 'object' && 'message' in error.error) {
      errorMessage = error.error.message as string;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('Leads service error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
