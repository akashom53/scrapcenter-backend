import { Component, Input } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Lead } from '../../../models/lead.model';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-lead-details',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatDividerModule, NgIf],
    templateUrl: './lead-details.component.html',
    styleUrl: './lead-details.component.css'
})
export class LeadDetailsComponent {
    @Input() lead?: Lead;

    getLeadStatus = (lead: Lead): { status: string, class: string } => {
        return lead.getCurrentStatus();
    }

    formatDate(date: Date | undefined): string {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString();
    }

} 