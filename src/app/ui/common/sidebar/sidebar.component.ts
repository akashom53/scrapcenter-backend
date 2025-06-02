
import { Component, computed, inject } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { AuthStore } from '../../../auth/state/auth.store';
import { AppStore } from '../../../state/app.store';

@Component({
  selector: 'app-sidebar',
  imports: [NgFor, NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private authStore = inject(AuthStore)
  private appStore = inject(AppStore)
  navItems = computed<{ title: string; icon: string; active: boolean, handler: () => void }[]>(() => {
    const isAdmin = this.authStore.isAdmin();

    if (isAdmin) return [
      { title: 'Dashboard', icon: 'fa fa-home', active: true, handler: this.handleDashboardClick.bind(this) },
      { title: 'Scrap Requests', icon: 'fa fa-file-text', active: false, handler: this.handleScrapRequestClick.bind(this) },
      { title: 'Users', icon: 'fa fa-user', active: false, handler: this.handleUserClick.bind(this) },
      { title: 'History', icon: 'fa fa-history', active: false, handler: this.emptyHandler.bind(this) },
      { title: 'Help & Support', icon: 'fa fa-question-circle', active: false, handler: this.emptyHandler.bind(this) },
      { title: 'Logout', icon: 'fa fa-sign-out', active: false, handler: this.logoutHandler.bind(this) }
    ]

    return [
      { title: 'Dashboard', icon: 'fa fa-home', active: true, handler: this.handleDashboardClick.bind(this) },
      { title: 'Scrap Requests', icon: 'fa fa-file-text', active: false, handler: this.handleScrapRequestClick.bind(this) },
      { title: 'Help & Support', icon: 'fa fa-question-circle', active: false, handler: this.emptyHandler.bind(this) },
      { title: 'Logout', icon: 'fa fa-sign-out', active: false, handler: this.logoutHandler.bind(this) }
    ]
  })

  handleNavClick(item: { title: string; icon: string; active: boolean, handler: () => void }) {
    this.navItems().forEach((navItem) => {
      navItem.active = navItem.title === item.title;
      if (navItem.active) {
        navItem.handler!();
      }
    });
  }

  private handleUserClick() {
    this.appStore.navigate('/users')
  }

  private handleScrapRequestClick() {
    this.appStore.navigate('/leads')
  }
  private handleDashboardClick() {
    this.appStore.navigate('/')
  }
  private logoutHandler() {
    // Show confirmation dialog before logging out
    const confirmLogout = confirm('Are you sure you want to logout?');

    if (confirmLogout) {
      this.authStore.logout();
    } else {
      // Reset the active state if user cancels logout
      this.navItems().forEach(item => {
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
