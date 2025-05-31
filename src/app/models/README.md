# Lead Model Helper Methods

This document explains how to use the helper methods available in the Lead model class.

## Overview

The `Lead` class has been enhanced with helper methods to provide common functionality and reduce code duplication across components. Previously, status logic and formatting was duplicated in multiple components.

## Usage

### Basic Setup

```typescript
import { Lead } from '../models/lead.model';

// Create a new Lead instance
const lead = new Lead({
  vehicleMake: 'Toyota',
  vehicleModel: 'Camry',
  vehicleYear: 2020,
  vehicleMileage: 50000,
  // ... other properties
});

// Or create from API data
const leadFromApi = Lead.fromApiData(apiResponse);
```

## Available Helper Methods

### Status Methods

#### `getCurrentStatus(): { status: string, class: string }`
Gets the current status of the lead with appropriate CSS class.

```typescript
const statusInfo = lead.getCurrentStatus();
console.log(statusInfo.status); // "Data Submitted"
console.log(statusInfo.class);  // "in-progress"
```

#### `isComplete(): boolean`
Checks if the lead is complete.

```typescript
if (lead.isComplete()) {
  // Lead has been completed
}
```

#### `isInProgress(): boolean`
Checks if the lead is currently in progress.

```typescript
if (lead.isInProgress()) {
  // Show progress indicator
}
```

#### `isPending(): boolean`
Checks if the lead is still pending.

```typescript
if (lead.isPending()) {
  // Show pending status
}
```

#### `getProgressPercentage(): number`
Gets the completion percentage (0-100).

```typescript
const progress = lead.getProgressPercentage(); // 40
```

### Vehicle Information Methods

#### `getVehicleDisplayName(): string`
Gets a formatted display name for the vehicle.

```typescript
const displayName = lead.getVehicleDisplayName();
// Returns: "Toyota Camry (2020)"
```

#### `getVehicleAge(): number`
Gets the age of the vehicle in years.

```typescript
const age = lead.getVehicleAge(); // 4 (if current year is 2024)
```

#### `isVintageVehicle(): boolean`
Checks if the vehicle is vintage (25+ years old).

```typescript
if (lead.isVintageVehicle()) {
  // Show vintage badge
}
```

#### `getFormattedMileage(): string`
Gets formatted mileage with locale-specific number formatting.

```typescript
const mileage = lead.getFormattedMileage();
// Returns: "150,000 km"
```

### Date Formatting Methods

#### `getFormattedCreatedDate(): string`
Gets formatted creation date.

```typescript
const createdDate = lead.getFormattedCreatedDate();
// Returns: "1/15/2024" (locale-specific)
```

#### `getFormattedUpdatedDate(): string`
Gets formatted last updated date.

```typescript
const updatedDate = lead.getFormattedUpdatedDate();
```

### Status Update Methods

#### `getLatestStatusUpdate(): LeadsUpdateStatus | null`
Gets the most recent status update.

```typescript
const latest = lead.getLatestStatusUpdate();
if (latest) {
  console.log(latest.stepName); // "review_data"
  console.log(latest.isComplete); // false
}
```

#### `getStatusUpdateByStep(stepName: LeadStatus): LeadsUpdateStatus | null`
Gets a specific status update by step name.

```typescript
const submitUpdate = lead.getStatusUpdateByStep('submit_data');
```

#### `isStepComplete(stepName: LeadStatus): boolean`
Checks if a specific step is complete.

```typescript
if (lead.isStepComplete('submit_data')) {
  // Data has been submitted
}
```

### Conversion Methods

#### `toApiFormat(): CreateLeadDto`
Converts the lead to the format expected by the API.

```typescript
const apiData = lead.toApiFormat();
// Use this when sending data to the API
```

#### `static fromApiData(data: any): Lead`
Creates a Lead instance from API response data.

```typescript
const lead = Lead.fromApiData(apiResponse);
```

## Usage in Components

### In Templates

```html
<!-- Display vehicle information -->
<h3>{{ lead.getVehicleDisplayName() }}</h3>
<p>Mileage: {{ lead.getFormattedMileage() }}</p>
<p>Age: {{ lead.getVehicleAge() }} years</p>

<!-- Display status -->
<span [class]="lead.getCurrentStatus().class">
  {{ lead.getCurrentStatus().status }}
</span>

<!-- Show progress -->
<div class="progress-bar">
  <div [style.width.%]="lead.getProgressPercentage()"></div>
</div>

<!-- Conditional display -->
<div *ngIf="lead.isVintageVehicle()" class="vintage-badge">
  Vintage Vehicle
</div>
```

### In Component Logic

```typescript
export class LeadComponent {
  @Input() lead!: Lead;

  getStatusClass(): string {
    return this.lead.getCurrentStatus().class;
  }

  canEdit(): boolean {
    return this.lead.isPending() || this.lead.isInProgress();
  }

  showVintageInfo(): boolean {
    return this.lead.isVintageVehicle();
  }
}
```

## Migration from Interface to Class

If you're migrating from the old interface-based approach:

### Before (Interface)
```typescript
// Old way - duplicated logic in components
getLeadStatus(lead: Lead): { status: string, class: string } {
  if ((lead.statusUpdates?.length ?? 0) <= 0) {
    return { status: 'Data not submitted', class: 'pending' };
  }
  // ... complex status logic duplicated everywhere
}
```

### After (Class with Helper Methods)
```typescript
// New way - use helper method
getLeadStatus(lead: Lead): { status: string, class: string } {
  return lead.getCurrentStatus();
}

// Or even better - use directly in template
// {{ lead.getCurrentStatus().status }}
```

## Benefits

1. **Reduced Code Duplication**: Status logic is centralized in the model
2. **Consistency**: All components use the same logic for status calculation
3. **Maintainability**: Changes to status logic only need to be made in one place
4. **Type Safety**: Helper methods are strongly typed
5. **Reusability**: Methods can be used across different components
6. **Testability**: Business logic can be tested independently of components 