import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-baseform-ng',
  imports: [
    ReactiveFormsModule,
    FormlyModule,
    FormlyMaterialModule,
    MatIconModule,
    MatNativeDateModule,
    FormlyMatDatepickerModule,
  ],
  templateUrl: './baseform-ng.component.html',
  styleUrl: './baseform-ng.component.css'
})
export class BaseformNgComponent {
  form = new FormGroup({});
  @Input() model!: any
  @Input() fields!: FormlyFieldConfig[];

  @Input() onFormChange!: (isvalid: boolean, model: any) => void;


  onModelChange() {
    this.onFormChange(this.form.valid, this.model);
  }

}
