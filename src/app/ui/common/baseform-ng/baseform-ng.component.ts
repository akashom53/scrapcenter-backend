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
  model = {
    'vehicleType': '',
    'vehicleMake': '',
    'vehicleModel': '',
    'vehicleYear': '',
    'vehicleRegistration': '',
    'vehicleCondition': '',
    'vehicleLocation': '',
    'preferredDate': '',
    'additionalNotes': '',
  };
  options: FormlyFormOptions = {

  };
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'two-column-grid',
      fieldGroup: [
        {
          key: 'vehicleMake',
          type: 'select',
          props: {
            label: 'Vehicle Brand',
            placeholder: 'Select your brand',
            required: true,
            options: [
              { value: 1, label: 'Option 1' },
              { value: 2, label: 'Option 2' },
              { value: 3, label: 'Option 3' },
              { value: 4, label: 'Option 4' },
            ],
          },
        },
        {
          key: 'vehicleModel',
          type: 'input',
          props: {
            label: 'Vehicle Model',
            placeholder: 'Enter your vehicle model',
            required: true,
          }
        },
        {
          key: 'vehicleYear',
          type: 'input',
          props: {
            label: 'Vehicle Year',
            placeholder: '2015',
            required: true,
            type: 'number'
          }
        },
        {
          key: 'vehicleCondition',
          type: 'select',
          props: {
            label: 'Vehicle Condition',
            placeholder: 'Select the vehicle condition',
            required: true,
            options: [
              { value: 'running', label: 'Running' },
              { value: 'not-running', label: 'Not Running' },
              { value: 'damaged', label: 'Damaged' },
              { value: 'parts-only', label: 'Parts Only' }
            ],
          },
        },
        {
          key: 'vehicleRegistration',
          type: 'input',
          className: 'full-width',
          props: {
            label: 'Vehicle Registration',
            placeholder: 'ABCD 1234',
            required: true,
          }
        },
        {
          key: 'vehicleLocation',
          type: 'input',
          props: {
            label: 'Pickup Location',
            placeholder: 'Enter your pickup location',
            required: true,
          }
        },
        {
          key: 'preferredDate',
          type: 'datepicker',
          props: {
            label: 'Preferred Collection Date',
            placeholder: '12/8/2023',
            required: true,
          },
        },
        {
          key: 'additionalNotes',
          className: 'full-width',
          type: 'textarea',
          props: {
            label: 'Additional Notes',
            placeholder: '',
            required: false,
          },
        },
      ]
    }
  ];


  @Input() onFormChange!: (isvalid: boolean, model: any) => void;


  onModelChange() {
    this.onFormChange(this.form.valid, this.model);
  }

  onSubmit(model: any) {
    console.log(model);
  }
}
