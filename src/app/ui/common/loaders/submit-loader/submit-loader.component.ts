import { Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@Component({
  selector: 'app-submit-loader',
  imports: [MatProgressBarModule],
  templateUrl: './submit-loader.component.html',
  styleUrl: './submit-loader.component.css'
})
export class SubmitLoaderComponent {

}
