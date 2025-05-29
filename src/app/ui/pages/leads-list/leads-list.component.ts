import { Component, computed, inject, OnInit } from '@angular/core';
import { AppStore } from '../../../state/app.store';
import { CommonModule } from '@angular/common';
import { LeadsTableComponent } from '../../common/leads-table/leads-table.component';

@Component({
  selector: 'app-leads-list',
  imports: [CommonModule, LeadsTableComponent],
  templateUrl: './leads-list.component.html',
  styleUrl: './leads-list.component.css'
})
export class LeadsListComponent implements OnInit {

  appStore = inject(AppStore);
  leads = computed(() => this.appStore.leads());
  handleRefreshClick() {
    this.appStore.fetchLeads();
  }

  ngOnInit(): void {
    this.handleRefreshClick()
  }
}
