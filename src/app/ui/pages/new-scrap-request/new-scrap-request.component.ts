import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AppStore } from '../../../state/app.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-scrap-request',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
  ],
  templateUrl: './new-scrap-request.component.html',
  styleUrl: './new-scrap-request.component.css'
})
export class NewScrapRequestComponent {
  private readonly appStore = inject(AppStore);
  private readonly fb = inject(FormBuilder);

  // Form group to handle all form inputs
  scrapRequestForm: FormGroup;

  // Vehicle type options
  vehicleTypes = [
    { value: 'car', label: 'Car' },
    { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'van', label: 'Van' },
    { value: 'truck', label: 'Truck' },
    { value: 'bus', label: 'Bus' },
    { value: 'other', label: 'Other' }
  ];

  // Vehicle condition options
  vehicleConditions = [
    { value: 'running', label: 'Running' },
    { value: 'not-running', label: 'Not Running' },
    { value: 'damaged', label: 'Damaged' },
    { value: 'parts-only', label: 'Parts Only' }
  ];

  // Selected files for vehicle images
  selectedFiles: File[] = [];

  // File upload status
  uploadStatus = {
    uploading: false,
    error: null as string | null
  };

  constructor() {
    // Initialize reactive form with validation
    this.scrapRequestForm = this.fb.group({
      vehicleType: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      registration: [''],
      condition: ['', Validators.required],
      location: ['', Validators.required],
      preferredDate: [''],
      notes: ['']
    });
  }

  // Handle file selection for vehicle images
  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFiles = Array.from(files);
      this.uploadStatus.error = null;
    }
  }

  // Remove selected file
  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  // Handle form submission
  onSubmit() {
    console.log(this.scrapRequestForm.value);
    if (this.scrapRequestForm.valid) {
      const formData = {
        ...this.scrapRequestForm.value,
        images: this.selectedFiles
      };

      // TODO: Implement actual submission logic
    } else {
      // Mark all fields as touched to show validation errors
      this.scrapRequestForm.markAllAsTouched();
    }
  }

  // Check if form field has error
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.scrapRequestForm.get(fieldName);
    return field ? field.hasError(errorType) && field.touched : false;
  }

  // Get error message for form field
  getErrorMessage(fieldName: string): string {
    const field = this.scrapRequestForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    if (field.errors['required']) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field.errors['min']) {
      return `Year must be ${field.errors['min'].min} or later`;
    }
    if (field.errors['max']) {
      return `Year cannot be later than ${field.errors['max'].max}`;
    }
    return 'Invalid input';
  }

  // Get user-friendly field labels
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      vehicleType: 'Vehicle Type',
      make: 'Make',
      model: 'Model',
      year: 'Year',
      registration: 'Registration',
      condition: 'Condition',
      location: 'Location',
      preferredDate: 'Preferred Date',
      notes: 'Notes'
    };
    return labels[fieldName] || fieldName;
  }

  handleBack() {
    this.appStore.back();
  }
}
