import { Component, inject, signal } from '@angular/core';
import { AppStore } from '../../../state/app.store';
import { MatIconModule } from '@angular/material/icon';
import { BaseformComponent } from "../../common/baseform/baseform.component";
import { BaseformNgComponent } from "../../common/baseform-ng/baseform-ng.component";
import { ImagePickerComponent } from "../../common/image-picker/image-picker.component";

@Component({
  selector: 'app-new-scrap-request',
  imports: [
    MatIconModule,
    BaseformComponent,
    BaseformNgComponent,
    ImagePickerComponent
  ],
  templateUrl: './new-scrap-request.component.html',
  styleUrl: './new-scrap-request.component.css'
})
export class NewScrapRequestComponent {

  isUploading = false;

  isFormValid = signal(false);

  images: File[] = [];
  private readonly appStore = inject(AppStore);

  onFilesChanged = (selectedFiles: File[]) => {
    this.images = selectedFiles;
    console.log(this.images);
  }

  handleFormChange = (isvalid: boolean, model: any) => {
    this.isFormValid.set(isvalid);
    console.log(isvalid, model);
  }

  handleBack = () => {
    this.appStore.back();
  }


  onSubmitClick = () => { };

  onSaveClick = () => { };
}
