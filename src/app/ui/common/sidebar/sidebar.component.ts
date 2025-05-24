import { Component, inject } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { AuthStore } from '../../../auth/state/auth.store';

@Component({
  selector: 'app-sidebar',
  imports: [NgFor, NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private authStore = inject(AuthStore)


  navItems = [
    { title: 'Dashboard', icon: 'fa fa-home', active: true, handler: this.emptyHandler.bind(this) },
    { title: 'My Vehicles', icon: 'fa fa-car', active: false, handler: this.emptyHandler.bind(this) },
    { title: 'Scrap Requests', icon: 'fa fa-file-text', active: false, handler: this.emptyHandler.bind(this) },
    { title: 'History', icon: 'fa fa-history', active: false, handler: this.emptyHandler.bind(this) },
    { title: 'Help & Support', icon: 'fa fa-question-circle', active: false, handler: this.emptyHandler.bind(this) },
    { title: 'Logout', icon: 'fa fa-sign-out', active: false, handler: this.logoutHandler.bind(this) }
  ];

  handleNavClick(item: { title: string; icon: string; active: boolean, handler: () => void }) {
    this.navItems.forEach((navItem) => {
      navItem.active = navItem.title === item.title;
      if (navItem.active) {
        navItem.handler!();
      }
    });
  }

  private logoutHandler() {
    // Show confirmation dialog before logging out
    const confirmLogout = confirm('Are you sure you want to logout?');

    if (confirmLogout) {
      this.authStore.logout();
    } else {
      // Reset the active state if user cancels logout
      this.navItems.forEach(item => {
        if (item.title === 'Logout') {
          item.active = false;
        }
      });
    }
  }

  private emptyHandler() {
    // do nothing
  }
}
