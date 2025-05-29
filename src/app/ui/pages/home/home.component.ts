import { Component, computed, inject, OnInit } from '@angular/core';
import { AuthStore } from '../../../auth/state/auth.store';
import { AppStore } from '../../../state/app.store';
import { LeadsTableComponent } from "../../common/leads-table/leads-table.component";

@Component({
  imports: [LeadsTableComponent],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private authStore = inject(AuthStore)
  private appStore = inject(AppStore)
  leads = computed(() => this.appStore.leads().slice(0, 3))

  header = {
    title: 'Recent Leads',
    btnText: 'View All',
    btnAction: this.handleViewAllClick.bind(this)
  }


  ngOnInit(): void {
    this.appStore.fetchLeads();
  }

  handleViewAllClick() {
    this.appStore.navigate('/leads')
  }

  handleNewClick() {
    this.appStore.navigate('/new')
  }

  logout() {
    this.authStore.logout();
  }
}
