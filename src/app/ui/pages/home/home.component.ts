import { Component, inject } from '@angular/core';
import { AuthStore } from '../../../auth/state/auth.store';
import { AppStore } from '../../../state/app.store';

@Component({
  imports: [],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private authStore = inject(AuthStore)
  private appStore = inject(AppStore)




  handleNewClick() {
    this.appStore.navigate('/new')
  }

  logout() {
    this.authStore.logout();
  }
}
