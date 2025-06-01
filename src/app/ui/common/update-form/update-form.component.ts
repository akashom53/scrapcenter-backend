import { Component, Input, OnInit } from '@angular/core';
import { Lead } from '../../../models/lead.model';
import { NgIf } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-update-form',
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormlyModule,
    FormlyMaterialModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './update-form.component.html',
  styleUrl: './update-form.component.css'
})
export class UpdateFormComponent implements OnInit {
  @Input() lead!: Lead;

  isAdmin = true;

  configModel!: {
    model: any,
    fields: FormlyFieldConfig[],
    actions: any
  }

  form = new FormGroup({});
  model!: any;
  fields!: FormlyFieldConfig[]
  actions!: any
  ngOnInit(): void {
    this.configModel = this.createModel()
    this.model = this.configModel.model
    this.fields = this.configModel.fields
    this.actions = this.configModel.actions

    console.log('Hello', this.model, this.fields, this.actions)
  }

  createModel() {
    if (!this.lead) return {
      model: {},
      fields: [],
      actions: {}
    }
    const status = this.lead.getCurrentStatus()
    console.log('Hello', status)
    switch (status.stepKey) {
      case 'submit_data':
        return {
          model: {},
          fields: [],
          actions: {
            title: 'Start Review',
            onClick: () => {
              console.log('start review')
            }
          }
        }
      case 'review_data':
        if (status.isComplete) {
          return {
            model: {},
            fields: [],
            actions: {
              title: 'Start Certificate Generation',
              onClick: () => {
                console.log('start certificate generation')
              }
            }
          }
        }
        return {
          model: { review_note: '', approve: false },
          fields: [
            {
              key: 'review_note',
              type: 'input',
              props: {
                label: 'Review Notes',
                placeholder: 'Enter any notes you have about the vehicle',
                required: true,
              }
            },
            {
              key: 'approve',
              type: 'checkbox',
              props: {
                label: 'Approve'
              }
            }
          ],
          actions: {
            title: 'Submit Review',
            onClick: () => {
              console.log('start review')
            }
          }
        }
      case 'gen_cert_1':
        if (status.isComplete) {
          return {
            model: {},
            fields: [],
            actions: {}
          }
        }
        return {
          model: { notes: '', cert_generated: false },
          fields: [
            {
              key: 'notes',
              type: 'input',
              props: {
                label: 'Notes',
                placeholder: 'Enter any notes you have about the vehicle',
                required: true,
              }
            },
            {
              key: 'cert_generated',
              type: 'checkbox',
              props: {
                label: 'Certificate Generated'
              }
            }
          ],
          actions: {
            title: 'Submit',
            onClick: () => {
              console.log('Certificate step completed')
            }
          }
        }

      case 'await_submission':
        if (status.isComplete) {
          return {
            model: {},
            fields: [],
            actions: {}
          }
        }
        return {
          model: { notes: '', vehicle_submitted: false },
          fields: [
            {
              key: 'notes',
              type: 'input',
              props: {
                label: 'Notes',
                placeholder: 'Enter any notes you have about the vehicle',
                required: true,
              }
            },
            {
              key: 'vehicle_submitted',
              type: 'checkbox',
              props: {
                label: 'Vehicle Submitted'
              }
            }
          ],
          actions: {
            title: 'Submit',
            onClick: () => {
              console.log('Vehicle submission step completed')
            }
          }
        }
      case 'complete':
        return {
          model: {},
          fields: [],
          actions: {}
        }
    }
  }

  onModelChange() {
    console.log(this.form.valid, this.model);
  }

}
