import { Component, inject, signal } from '@angular/core';
import { AppStore } from '../../../state/app.store';
import { MatIconModule } from '@angular/material/icon';
import { Step1formComponent } from "../../common/newlead/step1form/step1form.component";
import { FormstepperComponent } from "../../common/formstepper/formstepper.component";

@Component({
  selector: 'app-new-scrap-request',
  imports: [
    MatIconModule,
    Step1formComponent,
    FormstepperComponent
  ],
  templateUrl: './new-scrap-request.component.html',
  styleUrl: './new-scrap-request.component.css'
})
export class NewScrapRequestComponent {

  private readonly appStore = inject(AppStore);

  handleBack = () => {
    this.appStore.back();
  }
}
