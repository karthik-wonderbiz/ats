import { Component, inject } from '@angular/core';
import { FacesService } from '../../../../services/faces/faces.service';
import {
  UnknownFaces,
  ImageWithTime,
} from '../../../../model/UnknownFacesModel';

@Component({
  selector: 'app-unkonw-faces',
  templateUrl: './unkonw-faces.component.html',
  styleUrl: './unkonw-faces.component.css',
})
export class UnkonwFacesComponent {
  constructor(private unknownFaceService: FacesService) {}

  imagesWithTime: ImageWithTime[] = [
    {
      imageLabel: '',
      image: '',
    },
  ];
  unknownFaces: UnknownFaces = {
    status: '',
    images: [],
  };

  isFetcComplete: boolean = false;

  extractAndFormatDateTime(filename: string) {
    const matches = filename.match(/(\d{8})_(\d{6})/);

    if (matches) {
      const dateString = matches[1]; // '20240823'
      const timeString = matches[2]; // '100957'
      const year = parseInt(dateString.substring(0, 4), 10);
      const month = parseInt(dateString.substring(4, 6), 10) - 1;
      const day = parseInt(dateString.substring(6, 8), 10);
      const hour = parseInt(timeString.substring(0, 2), 10);
      const minute = parseInt(timeString.substring(2, 4), 10);

      const date = new Date(year, month, day, hour, minute);

      return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } else {
      throw new Error('Filename does not match the expected format');
    }
  }

  ngOnInit() {
    this.unknownFaceService.getUnknownFaces().subscribe({
      next: (data) => {
        this.unknownFaces.status = data.status;
        this.unknownFaces.images = data.images;
        this.imagesWithTime = this.unknownFaces.images.map((img) => {
          const myLabel = this.extractAndFormatDateTime(img);
          return {
            imageLabel: myLabel,
            image: img,
          };
        });
        this.isFetcComplete = true;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
