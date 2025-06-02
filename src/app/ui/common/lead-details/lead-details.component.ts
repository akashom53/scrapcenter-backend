import { Component, inject, Input } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Lead } from '../../../models/lead.model';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { AppStore } from '../../../state/app.store';

@Component({
    selector: 'app-lead-details',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatDividerModule, NgIf],
    templateUrl: './lead-details.component.html',
    styleUrl: './lead-details.component.css'
})
export class LeadDetailsComponent {
    private readonly appStore = inject(AppStore);
    lead = this.appStore.currentLead;

    getDisplayData = () => {
        if (!this.lead()) return []
        return Object.keys(this.lead()!).filter((key) => !([
            'statusUpdates',
            'id',
            'createdAt',
            'updatedAt',
            'userId',
            'status',
            'currentStatus',
            'currentStatusClass',
            'additionalNotes',
        ].includes(key))).map((key) => {
            return {
                key: this.getKeyLabel(key), value: this.lead()![key as keyof Lead]
            }
        })
    }

    getKeyLabel = (key: string) => {
        return key.replace('vehicle', '').replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase());
    }

    getLeadStatus = (): { status: string, class: string } => {
        return this.lead()!.getCurrentStatus();
    }

    formatDate(date: Date | undefined): string {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString();
    }

} 