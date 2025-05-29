import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-picker',
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './image-picker.component.html',
  styleUrl: './image-picker.component.css'
})
export class ImagePickerComponent {
  @Input() onFilesChanged!: (selectedFiles: File[]) => void;

  selectedFiles: File[] = [];
  uploadStatus = {
    uploading: false,
    error: null as string | null
  };


  onFileSelected = (event: any) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFiles = Array.from(files);
      this.uploadStatus.error = null;
    }
    this.onFilesChanged(this.selectedFiles);
  }

  removeFile = (index: number) => {
    this.selectedFiles.splice(index, 1);
    this.onFilesChanged(this.selectedFiles);
  }
}
