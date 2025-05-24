import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { NgIf } from '@angular/common';
import { SidebarComponent } from "../../common/sidebar/sidebar.component";

@Component({
  imports: [NgIf, SidebarComponent],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showUserDropdown = false;

  constructor(private authService: AuthService) { }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

  logout() {
    this.authService.logout();
  }
}
