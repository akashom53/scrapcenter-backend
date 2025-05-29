import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-baseform',
  imports: [
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './baseform.component.html',
  styleUrl: './baseform.component.css'
})
export class BaseformComponent {

  @Input() isFormValid: boolean = false;

  @Input() onSubmitClick!: () => void;

  @Input() onSaveClick!: () => void;
}
