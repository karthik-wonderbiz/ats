import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FaceService } from '../../services/enrolment/face.service';
import Toast from '../../model/enrolment/toast.model';
import User from '../../model/enrolment/user.model';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import * as blazeface from '@tensorflow-models/blazeface';

@Component({
  selector: 'app-enrol',
  templateUrl: './enrol.component.html',
  styleUrl: './enrol.component.css',
})
export class EnrolComponent {
  detectedFace: number = 0;
  constructor(private router: Router, private faceService: FaceService) {}
  isClose: boolean = false;
  isEncodingDisabled: boolean = false;
  isCapturedDisabled: boolean = false;
  @ViewChild('video', { static: true })
  videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('response', { static: true })
  responseElement!: ElementRef<HTMLDivElement>;
  @Output() closeToast = new EventEmitter();
  private stream: MediaStream | null = null;

  private model: blazeface.BlazeFaceModel | null = null;
  private modelInterval: any;
  isCameraOpen: boolean = false;
  isModelLoaded: boolean = false;

  res: string = '';
  toast: Toast = {
    position: 'top',
    message: '',
    type: 'success',
  };
  user: User = {
    userId: 0,
    firstName: '',
    lastName: '',
    designationName: '',
    email: '',
    profilePic: '',
    id: 0,
  };
  private loadUser(): void {
    const userString = localStorage.getItem('user');
    if (!userString) {
      this.router.navigate(['/']);
      return;
    }
    try {
      const user = JSON.parse(userString) as User;
      this.user = user;
      console.log(user)
    } catch (e) {
      console.error('Error parsing user data from localStorage:', e);
      this.router.navigate(['/']);
    }
  }

  async ngOnInit() {
    try {
      await tf.setBackend('webgl');
      await tf.ready();
      console.log('Using WebGL backend');
    } catch (err) {
      console.warn('WebGL backend failed, falling back to CPU:', err);
      await tf.setBackend('cpu');
      await tf.ready();
      console.log('Using CPU backend');
    } finally {
      this.model = await blazeface.load();
      this.isModelLoaded = true;
      this.loadUser();
      this.initializeWebcam();
      console.log('Model loaded');
    }
  }
  ngOnDestroy(): void {
    this.stopWebcam();
  }

  private async initializeWebcam(): Promise<void> {
    if (this.isCameraOpen) {
      this.stopWebcam();
    }
    const video: HTMLVideoElement | null = document.getElementById(
      'video'
    ) as HTMLVideoElement;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        this.videoElement.nativeElement.srcObject = this.stream;
        video.addEventListener('playing', this.detectFaces.bind(this));
        this.isCameraOpen = true;
      } catch (error) {
        console.log('Error accessing webcam: ', error);
      }
    } else {
      console.error('getUserMedia not supported in this browser.');
    }
  }

  detectFaces() {
    if (this.modelInterval) {
      clearInterval(this.modelInterval);
    }
    this.modelInterval = setInterval(async () => {
      try {
        const faces = await this.model!.estimateFaces(
          this.videoElement.nativeElement,
          false
        );
        this.detectedFace = faces.length;
      } catch (error) {
        console.error(error);
      }
    }, 100);
  }

  private stopWebcam(): void {
    if (this.stream) {
      const tracks = this.stream.getTracks();
      clearInterval(this.modelInterval);
      tracks.forEach((track) => track.stop());
      this.videoElement.nativeElement.srcObject = null;
      this.stream = null;
      this.isCameraOpen = false;
      this.videoElement.nativeElement.removeEventListener(
        'playing',
        this.detectFaces.bind(this)
      );
    }
  }

  async captureImage(): Promise<void> {
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    this.isCapturedDisabled = true;
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg')
      );

      if (imageBlob) {
        const formData = new FormData();
        console.log(this.user)
        formData.append('file', imageBlob, 'capture.jpg');
        formData.append('employee_id', this.user.id.toString());

        this.faceService.captureImage(formData).subscribe(
          (data) => {
            this.isClose = true;
            this.toast.message = 'Face captured';
            this.toast.position = 'top';
            this.toast.type = 'success';
            this.isCapturedDisabled = false;
            setTimeout(() => {
              this.isClose = false;
            }, 4000);
          },
          (error) => {
            console.error('Error capturing image:', error);
            this.isCapturedDisabled = false;
          }
        );
      }
    }
  }

  onClose = () => {
    this.isClose = false;
  };

  async saveEncodings(): Promise<void> {
    this.isEncodingDisabled = true;
    this.isCapturedDisabled = true;
    const formData = new FormData();
    this.stopWebcam();
    formData.append('employee_id', this.user.id.toString());
    this.faceService.saveEncodings(formData).subscribe(
      (data) => {
        this.isClose = true;
        this.toast.message = 'Encodings saved';
        this.toast.position = 'top';
        this.toast.type = 'success';
        this.isCapturedDisabled = false;
        this.router.navigate(['/login']);
        setTimeout(() => {
          this.isClose = false;
        }, 4000);
      },
      (error) => {
        console.error('Error saving encodings:', error);
        this.isCapturedDisabled = false;
      }
    );
  }
}
