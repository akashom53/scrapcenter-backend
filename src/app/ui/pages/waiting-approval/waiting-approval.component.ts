import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../../auth/state/auth.store';

@Component({
  selector: 'app-waiting-approval',
  imports: [CommonModule, MatIconModule],
  templateUrl: './waiting-approval.component.html',
  styleUrl: './waiting-approval.component.css'
})
export class WaitingApprovalComponent implements OnInit {
  private readonly authStore = inject(AuthStore);

  handleLogout(): void {
    // Clear user session/token
    localStorage.removeItem('authToken');
    sessionStorage.clear();

    // Navigate to login page
    this.authStore.logout();
  }

  ngOnInit(): void {
    console.log(this.authStore.isApproved());
  }

}
