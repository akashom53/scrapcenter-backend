import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { NgIf } from '@angular/common';
import { SidebarComponent } from "../../common/sidebar/sidebar.component";
import { AuthStore } from '../../../auth/state/auth.store';
import { AppStore } from '../../../state/app.store';

@Component({
  imports: [NgIf, SidebarComponent],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showUserDropdown = false;
  private authStore = inject(AuthStore)
  private appStore = inject(AppStore)

  constructor(private authService: AuthService) { }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

  handleNewClick() {
    this.appStore.navigate('/new')
  }

  logout() {
    this.authStore.logout();
  }
}
