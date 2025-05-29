import { Component, computed, Input, Signal } from '@angular/core';
import { Lead } from '../../../services/leads/leads.service';
import { CommonModule, NgIf } from '@angular/common';


@Component({
  selector: 'app-leads-table',
  imports: [CommonModule, NgIf],
  templateUrl: './leads-table.component.html',
  styleUrl: './leads-table.component.css'
})
export class LeadsTableComponent {
  @Input() leads?: Signal<Lead[]>;
  @Input() handleRefreshClick?: () => void;
  @Input() headerData?: { title: string, btnText: string, btnAction: () => void };


  // displayLeads = computed(() => this.leads.map((lead) => this.getLeadData(lead)));
  columns = [
    "Vehicle",
    "Registration",
    "Date",
    "Status",
    "Actions",
  ]

  getDisplayLeads = () => {
    if (!this.leads) {
      return [];
    }
    return this.leads().map((lead) => this.getLeadData(lead));
  }
  getLeadData = (lead: Lead) => {
    return {
      vehicle: `${lead.vehicleMake} ${lead.vehicleModel}`,
      registration: lead.vehicleRegistration,
      date: this.dateString(lead.createdAt),
      status: lead.status,
    }
  }

  dateString = (date?: Date) => {
    if (!date) {
      return '';
    }
    return new Date(date).toLocaleDateString();
  }

  handleRefreshClickActual() {
    if (this.handleRefreshClick) {
      this.handleRefreshClick();
    }
  }

}
