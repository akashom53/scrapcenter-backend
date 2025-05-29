import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-formsubmit',
  imports: [
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './formsubmit.component.html',
  styleUrl: './formsubmit.component.css'
})
export class FormSubmitComponent {

  @Input() isFormValid: boolean = false;

  @Input() onSubmitClick!: () => void;

  @Input() onSaveClick!: () => void;
}
