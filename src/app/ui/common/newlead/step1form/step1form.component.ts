import { Component, computed, inject, Input, Signal, signal } from '@angular/core';
import { BaseformNgComponent } from "../../baseform-ng/baseform-ng.component";
import { ImagePickerComponent } from "../../image-picker/image-picker.component";
import { FormSubmitComponent } from "../../formsubmit/formsubmit.component";
import { AppStore } from '../../../../state/app.store';
import { LeadsService } from '../../../../services/leads/leads.service';
import { tapResponse } from '@ngrx/operators';
import { CommonModule } from '@angular/common';
import { Step1Form } from './step1form.form';
import { SubmitLoaderComponent } from "../../loaders/submit-loader/submit-loader.component";
import { SuccessComponent } from "../../success/success.component";

@Component({
  selector: 'app-step1form',
  imports: [BaseformNgComponent, ImagePickerComponent, FormSubmitComponent, CommonModule, SubmitLoaderComponent, SuccessComponent],
  templateUrl: './step1form.component.html',
  styleUrl: './step1form.component.css'
})
export class Step1formComponent {

  formConfig = new Step1Form()
  model = computed(() => this.formConfig.model);
  fields = computed(() => this.formConfig.fields);

  @Input() onSuccess!: () => void;
  @Input() onFailure!: () => void;


  isFormValid = signal(false);

  isSubmitting = signal(false);
  isSubmitSuccess = signal(true);
  isSubmitFailure = signal(false);

  showForm: Signal<boolean> = computed(() => {
    return !this.isSubmitSuccess() && !this.isSubmitFailure() && !this.isSubmitting();
  })

  images: File[] = [];
  private readonly appStore = inject(AppStore);
  private readonly leadsService = inject(LeadsService);

  onFormChange = (isvalid: boolean, model: any) => {
    this.isFormValid.set(isvalid);
    console.log(isvalid, model);
  }



  onFilesChanged = (selectedFiles: File[]) => {
    this.images = selectedFiles;
    console.log(this.images);
  }



  handleBack = () => {
    this.appStore.back();
  }


  onSubmitClick = () => {
    this.isSubmitting.set(true);
    this.leadsService.newLead(this.formConfig.model, this.images).pipe(
      tapResponse(
        (res) => {
          console.log("res");
          this.isSubmitting.set(false);
          this.isSubmitSuccess.set(true);
          this.isSubmitFailure.set(false);

        },
        (err) => {
          console.log("err");
          this.isSubmitting.set(false);
          this.isSubmitSuccess.set(false);
          this.isSubmitFailure.set(true);
        }
      )
    ).subscribe();
  };

  onSaveClick = () => { };
}
