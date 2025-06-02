import { Component, computed, inject } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthStore } from '../../../auth/state/auth.store';
import { WaitingApprovalComponent } from "../../pages/waiting-approval/waiting-approval.component";

@Component({
  selector: 'app-main-layout',
  imports: [SidebarComponent, RouterOutlet, NgIf, WaitingApprovalComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  private readonly authStore = inject(AuthStore);

  isApproved = this.authStore.isApproved;
  showUserDropdown = false;
  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

}
