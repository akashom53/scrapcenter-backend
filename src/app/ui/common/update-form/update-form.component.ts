import { Component, computed, effect, inject, Input, OnInit } from '@angular/core';
import { Lead } from '../../../models/lead.model';
import { NgIf } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LeadsService, UpdateLeadStatusRequest } from '../../../services/leads/leads.service';
import { AppStore } from '../../../state/app.store';
import { AuthStore } from '../../../auth/state/auth.store';

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

  private leadsService = inject(LeadsService);
  private appStore = inject(AppStore);
  private authStore = inject(AuthStore);

  isAdmin = this.authStore.isAdmin;

  configModel!: {
    model: any,
    fields: FormlyFieldConfig[],
    actions: any
  }

  form = new FormGroup({});
  model!: any;
  fields!: FormlyFieldConfig[]
  actions!: any
  showActions = computed(() => Object.keys(this.actions).length > 0);

  lead = this.appStore.currentLead;

  constructor() {
    effect(() => {
      const currentLead = this.lead();
      console.log('Current lead updated', currentLead)
      if (currentLead) {
        this.updateFormConfig();
      }
    });
  }
  ngOnInit(): void {
    // Initial setup
    this.updateFormConfig();


  }

  private updateFormConfig() {
    this.configModel = this.createModel();
    this.model = this.configModel.model;
    this.fields = this.configModel.fields;
    this.actions = this.configModel.actions;
  }

  createModel() {
    if (!this.lead()) return {
      model: {},
      fields: [],
      actions: {}
    }
    const status = this.lead()!.getCurrentStatus()
    console.log('Status', status)
    switch (status.stepKey) {
      case 'submit_data':
        return {
          model: {},
          fields: [],
          actions: {
            title: 'Start Review',
            onClick: () => {
              const statusData: UpdateLeadStatusRequest = {
                stepName: 'review_data',
                oldStatus: 'submit_data',
                newStatus: 'review_data',
                isComplete: false,
                createdAt: new Date().toISOString(),
              }
              this.leadsService.updateLeadStatusWithData(this.lead()!.id!, statusData).subscribe(response => {
                console.log('Lead status updated successfully', response);
              });


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
                const statusData: UpdateLeadStatusRequest = {
                  stepName: 'gen_cert_1',
                  oldStatus: 'review_data',
                  newStatus: 'gen_cert_1',
                  isComplete: false,
                  createdAt: new Date().toISOString(),
                }
                this.appStore.updateCurrentLead(statusData);
                // this.leadsService.updateLeadStatusWithData(this.lead()!.id!, statusData).subscribe(response => {
                //   console.log('Lead status updated successfully', response);
                // });
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
              console.log('submit review')
              const statusData: UpdateLeadStatusRequest = {
                stepName: 'review_data',
                oldStatus: 'review_data',
                newStatus: 'gen_cert_1',
                isComplete: true,
                createdAt: new Date().toISOString(),
              }

              this.appStore.updateCurrentLead(statusData);
              // this.leadsService.updateLeadStatusWithData(this.lead()!.id!, statusData).subscribe(response => {
              //   console.log('Lead status updated successfully', response);
              // });
            }
          }
        }
      case 'gen_cert_1':
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
            title: 'Mark Cretificate Generated',
            onClick: () => {
              console.log('Certificate step completed')
              const statusData: UpdateLeadStatusRequest = {
                stepName: 'gen_cert_1',
                oldStatus: 'gen_cert_1',
                newStatus: 'await_submission',
                isComplete: true,
                createdAt: new Date().toISOString(),
              }
              this.leadsService.updateLeadStatusWithData(this.lead()!.id!, statusData).subscribe(response => {
                console.log('Lead status updated successfully', response);
                const statusData: UpdateLeadStatusRequest = {
                  stepName: 'await_submission',
                  oldStatus: 'gen_cert_1',
                  newStatus: 'await_submission',
                  isComplete: false,
                  createdAt: new Date().toISOString(),
                }

                this.appStore.updateCurrentLead(statusData);
                // this.leadsService.updateLeadStatusWithData(this.lead()!.id!, statusData).subscribe(response => {
                //   console.log('Lead status updated successfully 2', response);
                // });
              });
            }
          }
        }

      case 'await_submission':
        if (status.isComplete) {
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
                key: 'completed',
                type: 'checkbox',
                props: {
                  label: 'Finished'
                }
              }
            ],
            actions: {
              title: 'Mark Review Complete',
              onClick: () => {
                console.log('Mark review complete')
                const statusData: UpdateLeadStatusRequest = {
                  stepName: 'complete',
                  oldStatus: 'complete',
                  newStatus: 'complete',
                  isComplete: true,
                  createdAt: new Date().toISOString(),
                }

                this.appStore.updateCurrentLead(statusData);
                // this.leadsService.updateLeadStatusWithData(this.lead()!.id!, statusData).subscribe(response => {
                //   console.log('Lead status updated successfully', response);
                // });
              }
            }
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
            title: 'Mark Vehicle Submitted',
            onClick: () => {
              console.log('Vehicle submission step completed')
              const statusData: UpdateLeadStatusRequest = {
                stepName: 'await_submission',
                oldStatus: 'await_submission',
                newStatus: 'complete',
                isComplete: true,
                createdAt: new Date().toISOString(),
              }

              this.appStore.updateCurrentLead(statusData);
              // this.leadsService.updateLeadStatusWithData(this.lead()!.id!, statusData).subscribe(response => {
              //   console.log('Lead status updated successfully', response);
              // });
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
