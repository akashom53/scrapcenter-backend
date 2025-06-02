import { Component, computed, inject, OnInit } from '@angular/core';
import { AppStore } from '../../../state/app.store';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../services/users.service';

type Action = {
  label: string;
  action: (user: User) => void;
}

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  private readonly appStore = inject(AppStore);
  users = computed(() => this.appStore.users());

  getActions(user: User): Action[] {
    let ret: Action[] = [];
    if (!user.isAdmin) {
      ret.push({ label: 'Set Admin', action: () => this.handleSetAdminClick(user) });
    }
    if (!user.isApproved) {
      ret.push({ label: 'Approve', action: () => this.handleApproveClick(user) });
    }
    return ret;
  }

  ngOnInit(): void {
    this.appStore.fetchUsers();
  }

  handleSetAdminClick(user: User): void {
    this.appStore.setAdmin(user);
  }

  handleApproveClick(user: User): void {
    this.appStore.setApproved(user);
  }

}
