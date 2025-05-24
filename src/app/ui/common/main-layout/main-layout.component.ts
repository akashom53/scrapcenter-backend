import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [SidebarComponent, RouterOutlet, NgIf],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  showUserDropdown = false;
  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

}
