// Lead model with helper methods
export type LeadStatus = 'submit_data' | 'review_data' | 'gen_cert_1' | 'await_submission' | 'complete';

export interface LeadsUpdateStatus {
    id: number;
    createdAt: string;
    stepName: LeadStatus;
    oldStatus: LeadStatus;
    newStatus: LeadStatus;
    files: string[];
    isComplete: boolean;
    leadId: number;
}

export class Lead {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    vehicleMake: string = '';
    vehicleRegistration: string = '';
    vehicleModel: string = '';
    vehicleYear: number = new Date().getFullYear();
    vehicleMileage: number = 0;
    vehicleCondition: string = '';
    vehicleLocation: string = '';
    additionalNotes?: string;
    status?: LeadStatus;
    userId?: number;
    statusUpdates: LeadsUpdateStatus[] = [];

    constructor(data: Partial<Lead> = {}) {
        Object.assign(this, data);
        this.statusUpdates = data.statusUpdates || [];
    }

    // Helper method to get current status information
    getCurrentStatus(): { status: string, class: string, stepKey: LeadStatus } {
        console.log(this.statusUpdates);
        if ((this.statusUpdates?.length ?? 0) <= 0) {
            return { status: 'Data not submitted', class: 'pending', stepKey: 'submit_data' };
        }
        const lastUpdate = this.statusUpdates[this.statusUpdates.length - 1];
        switch (lastUpdate.stepName) {
            case 'submit_data':
                console.log('last', lastUpdate.isComplete, this);
                if (lastUpdate.isComplete) {
                    return { status: 'Data Submitted', class: 'in-progress', stepKey: 'submit_data' };
                } else {
                    return { status: 'Data not submitted', class: 'pending', stepKey: 'submit_data' };
                }
            case 'review_data':
                if (lastUpdate.isComplete) {
                    return { status: "Request Approved", class: 'in-progress', stepKey: 'review_data' };
                } else {
                    return { status: 'Under Review', class: 'in-progress', stepKey: 'review_data' };
                }
            case 'gen_cert_1':
                if (lastUpdate.isComplete) {
                    return { status: 'Certificate Generated', class: 'in-progress', stepKey: 'gen_cert_1' };
                } else {
                    return { status: "Generating Certificate", class: 'in-progress', stepKey: 'gen_cert_1' };
                }
            case 'await_submission':
                if (lastUpdate.isComplete) {
                    return { status: 'Vehicle Submitted', class: 'completed', stepKey: 'await_submission' };
                } else {
                    return { status: "Awaiting Vehicle Submission", class: 'in-progress', stepKey: 'await_submission' };
                }
            case 'complete':
                return { status: 'Complete', class: 'completed', stepKey: 'complete' };
            default:
                return { status: 'Unknown', class: 'pending', stepKey: 'submit_data' };
        }
    }

    // Helper method to get full vehicle display name
    getVehicleDisplayName(): string {
        return `${this.vehicleMake} ${this.vehicleModel} (${this.vehicleYear})`;
    }

    // Helper method to check if lead is complete
    isComplete(): boolean {
        const currentStatus = this.getCurrentStatus();
        return currentStatus.class === 'completed';
    }

    // Helper method to check if lead is in progress
    isInProgress(): boolean {
        const currentStatus = this.getCurrentStatus();
        return currentStatus.class === 'in-progress';
    }

    // Helper method to check if lead is pending
    isPending(): boolean {
        const currentStatus = this.getCurrentStatus();
        return currentStatus.class === 'pending';
    }

    // Helper method to format dates
    getFormattedCreatedDate(): string {
        if (!this.createdAt) return 'N/A';
        return new Date(this.createdAt).toLocaleDateString();
    }

    getFormattedUpdatedDate(): string {
        if (!this.updatedAt) return 'N/A';
        return new Date(this.updatedAt).toLocaleDateString();
    }

    // Helper method to get vehicle age
    getVehicleAge(): number {
        const currentYear = new Date().getFullYear();
        return currentYear - this.vehicleYear;
    }

    // Helper method to format mileage with commas
    getFormattedMileage(): string {
        return this.vehicleMileage.toLocaleString() + ' km';
    }

    // Helper method to check if vehicle is vintage (older than 25 years)
    isVintageVehicle(): boolean {
        return this.getVehicleAge() >= 25;
    }

    // Helper method to get the latest status update
    getLatestStatusUpdate(): LeadsUpdateStatus | null {
        if (!this.statusUpdates || this.statusUpdates.length === 0) {
            return null;
        }
        return this.statusUpdates[this.statusUpdates.length - 1];
    }

    // Helper method to get status update by step name
    getStatusUpdateByStep(stepName: LeadStatus): LeadsUpdateStatus | null {
        return this.statusUpdates?.find(update => update.stepName === stepName) || null;
    }

    // Helper method to check if a specific step is complete
    isStepComplete(stepName: LeadStatus): boolean {
        const update = this.getStatusUpdateByStep(stepName);
        return update?.isComplete ?? false;
    }

    // Helper method to get progress percentage
    getProgressPercentage(): number {
        const totalSteps = 5; // submit_data, review_data, gen_cert_1, await_submission, complete
        const completedSteps = this.statusUpdates?.filter(update => update.isComplete).length || 0;
        return Math.round((completedSteps / totalSteps) * 100);
    }

    // Static method to create Lead instance from API data
    static fromApiData(data: any): Lead {
        return new Lead({
            ...data,
            createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
        });
    }

    // Method to convert to API format
    toApiFormat(): CreateLeadDto {
        return {
            vehicleRegistration: this.vehicleRegistration,
            vehicleMake: this.vehicleMake,
            vehicleModel: this.vehicleModel,
            vehicleYear: this.vehicleYear,
            vehicleMileage: this.vehicleMileage,
            vehicleCondition: this.vehicleCondition,
            vehicleLocation: this.vehicleLocation,
            additionalNotes: this.additionalNotes,
            userId: this.userId,
        };
    }
}

// DTOs remain as interfaces since they don't need helper methods
export interface CreateLeadDto {
    vehicleRegistration: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: number;
    vehicleMileage: number;
    vehicleCondition: string;
    vehicleLocation: string;
    additionalNotes?: string;
    userId?: number;
}

export interface UpdateLeadDto {
    vehicleRegistration?: string;
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

export interface LeadFilters {
    status?: string;
    vehicleMake?: string;
    vehicleModel?: string;
    fromDate?: Date;
    toDate?: Date;
    userId?: number;
} 