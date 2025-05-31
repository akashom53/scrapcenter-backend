import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Lead, LeadStatus } from '../models/lead.model';

@Component({
    selector: 'app-lead-helper-examples',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="examples-container">
      <h2>Lead Helper Methods Examples</h2>
      
      <div class="example-section">
        <h3>Basic Information</h3>
        <p><strong>Vehicle Display Name:</strong> {{ sampleLead.getVehicleDisplayName() }}</p>
        <p><strong>Formatted Mileage:</strong> {{ sampleLead.getFormattedMileage() }}</p>
        <p><strong>Vehicle Age:</strong> {{ sampleLead.getVehicleAge() }} years</p>
        <p><strong>Is Vintage Vehicle:</strong> {{ sampleLead.isVintageVehicle() ? 'Yes' : 'No' }}</p>
      </div>

      <div class="example-section">
        <h3>Status Information</h3>
        <p><strong>Current Status:</strong> 
          <span [class]="sampleLead.getCurrentStatus().class">
            {{ sampleLead.getCurrentStatus().status }}
          </span>
        </p>
        <p><strong>Is Complete:</strong> {{ sampleLead.isComplete() ? 'Yes' : 'No' }}</p>
        <p><strong>Is In Progress:</strong> {{ sampleLead.isInProgress() ? 'Yes' : 'No' }}</p>
        <p><strong>Is Pending:</strong> {{ sampleLead.isPending() ? 'Yes' : 'No' }}</p>
        <p><strong>Progress Percentage:</strong> {{ sampleLead.getProgressPercentage() }}%</p>
      </div>

      <div class="example-section">
        <h3>Date Information</h3>
        <p><strong>Created Date:</strong> {{ sampleLead.getFormattedCreatedDate() }}</p>
        <p><strong>Updated Date:</strong> {{ sampleLead.getFormattedUpdatedDate() }}</p>
      </div>

      <div class="example-section">
        <h3>Status Updates</h3>
        <p><strong>Latest Status Update:</strong> {{ getLatestUpdateInfo() }}</p>
        <p><strong>Data Submission Complete:</strong> {{ sampleLead.isStepComplete('submit_data') ? 'Yes' : 'No' }}</p>
        <p><strong>Review Complete:</strong> {{ sampleLead.isStepComplete('review_data') ? 'Yes' : 'No' }}</p>
      </div>

      <div class="example-section">
        <h3>API Conversion</h3>
        <button (click)="showApiFormat()">Show API Format</button>
        <pre *ngIf="showApiData">{{ apiFormatData }}</pre>
      </div>
    </div>
  `,
    styles: [`
    .examples-container {
      padding: 20px;
      max-width: 800px;
    }
    
    .example-section {
      margin-bottom: 30px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    
    .example-section h3 {
      margin-top: 0;
      color: #333;
    }
    
    .pending { color: #ff9800; }
    .in-progress { color: #2196f3; }
    .completed { color: #4caf50; }
    
    pre {
      background: #f5f5f5;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
    }
    
    button {
      padding: 10px 20px;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:hover {
      background: #1976d2;
    }
  `]
})
export class LeadHelperExamplesComponent {
    sampleLead: Lead;
    showApiData = false;
    apiFormatData = '';

    constructor() {
        // Create a sample lead with some status updates for demonstration
        this.sampleLead = new Lead({
            id: 1,
            vehicleMake: 'Toyota',
            vehicleModel: 'Camry',
            vehicleYear: 1995,
            vehicleMileage: 150000,
            vehicleCondition: 'Good',
            vehicleLocation: 'Zagreb',
            vehicleRegistration: 'ZG-1234-AB',
            additionalNotes: 'Well maintained vehicle',
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-20'),
            statusUpdates: [
                {
                    id: 1,
                    createdAt: '2024-01-15T10:00:00Z',
                    stepName: 'submit_data',
                    oldStatus: 'submit_data',
                    newStatus: 'submit_data',
                    files: [],
                    isComplete: true,
                    leadId: 1
                },
                {
                    id: 2,
                    createdAt: '2024-01-16T10:00:00Z',
                    stepName: 'review_data',
                    oldStatus: 'submit_data',
                    newStatus: 'review_data',
                    files: [],
                    isComplete: false,
                    leadId: 1
                }
            ]
        });
    }

    getLatestUpdateInfo(): string {
        const latest = this.sampleLead.getLatestStatusUpdate();
        if (!latest) return 'No updates';
        return `${latest.stepName} (${latest.isComplete ? 'Complete' : 'In Progress'})`;
    }

    showApiFormat(): void {
        this.showApiData = !this.showApiData;
        if (this.showApiData) {
            this.apiFormatData = JSON.stringify(this.sampleLead.toApiFormat(), null, 2);
        }
    }
} 