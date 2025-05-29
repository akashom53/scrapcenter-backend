import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-formstepper',
  imports: [MatIconModule, NgFor],
  templateUrl: './formstepper.component.html',
  styleUrl: './formstepper.component.css'
})
export class FormstepperComponent {
  steps = [
    {
      title: 'Submit Vehicle Data',
      description: 'Provide vehicle details and submit the form.',
    },
    {
      title: 'Review',
      description: 'We\'ll review your submission within 2 working days',
    },
    {
      title: 'Generating Certificate 1',
      description: 'Our Team will generate your certificate within X working days',
    },
    {
      title: 'Awaiting Vehicle Submission',
      description: 'Arrange for the vehicle to be delivered within Y working days',
    },
    {
      title: 'Complete',
      description: 'Certificate 2 will be provided upon delivery of vehicle',
    },
  ]
}
