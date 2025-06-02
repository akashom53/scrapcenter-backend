import { Component, computed, inject, Input, Signal } from '@angular/core';
import { Lead } from '../../../models/lead.model';
import { CommonModule, NgIf } from '@angular/common';
import { AppStore } from '../../../state/app.store';


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

  private readonly appStore = inject(AppStore);

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
      vehicle: lead.getVehicleDisplayName(),
      registration: lead.vehicleRegistration,
      date: lead.getFormattedCreatedDate(),
      status: lead.getCurrentStatus(),
      lead: lead
    }
  }

  getLeadStatus = (lead: Lead): { status: string, class: string } => {
    return lead.getCurrentStatus();
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


  handleViewClick(lead: Lead) {
    this.appStore.setCurrentLead(lead);
    this.appStore.navigate(`/lead/${lead.id}`);
  }

}
