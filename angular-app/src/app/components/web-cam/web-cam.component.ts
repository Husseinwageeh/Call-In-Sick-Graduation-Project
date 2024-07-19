import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject, flatMap } from 'rxjs';
import { AuthenticatedUser } from 'src/app/models/AuthenticatedUser';
import { OCRMessage } from 'src/app/models/OCRMessage';
import {
  AuthenticationStates,
  authenticationStatesMessages,
} from 'src/app/models/authenticationStates';
import { AuthenticationService } from 'src/app/services/authentication.service';

import { ImageProcessingService } from 'src/app/services/image-processing.service';
import { RegistrationService } from 'src/app/services/registration.service';
@Component({
  selector: 'app-web-cam',
  templateUrl: './web-cam.component.html',
  styleUrls: ['./web-cam.component.css'],
})
export class WebCamComponent {
  private maxDeviceWarnings = 10;
  private maxFaceWarnings = 10;
  private isTestingPhase = false;

  framesCaptured: number = 0;
  trigger: Subject<any> = new Subject();
  webcamImage: WebcamImage | undefined;

  unVerifiedCount = 0;
  deviceNotDetectedCount = 0;

  alertMessage: string = '';
  showErrorMessage: boolean = false;

  showDeviceNotDetectedMessage: boolean = false;
  id!: any; //represents timeout

  currentAuthenticationState = AuthenticationStates.INITIAL_STATE;
  isFirstTrueVerificationOccured = false;

  lastProcessedFrameNumber = 0;
  isOCRRunning: boolean = false;

  isFaceDetected: boolean = false;
  currentFrameNumber = 0;

  public authenticationStatesMessages = authenticationStatesMessages;
  private currentUser!: AuthenticatedUser;

  constructor(
    private router: Router,
    private imageProcessingService: ImageProcessingService,
    private registrationService: RegistrationService,
    private authenticationService: AuthenticationService
  ) {}
  ngOnDestroy() {
    clearInterval(this.id);
  }
  ngOnInit() {
    this.currentUser = this.authenticationService.getAuthenticatedUser()!;

    this.currentAuthenticationState = AuthenticationStates.INITIAL_STATE;

    this.unVerifiedCount = 0;
    this.deviceNotDetectedCount = 0;
    this.showErrorMessage = false;

    console.log('called');
    this.imageProcessingService.initiateSocketConnection();

    this.currentFrameNumber = 0;
    this.id = setInterval(() => {
      this.currentFrameNumber++;
      if (this.imageProcessingService.isConnected) {
        this.triggerSnapshot();
        if (this.webcamImage) {
          this.imageProcessingService.sendImageToAPI(
            this.webcamImage,
            this.currentAuthenticationState,
            this.currentFrameNumber
          );
        }

        this.handleIdentityVerificationProcess();

        if (
          this.currentAuthenticationState ==
            AuthenticationStates.DEVICE_SHOWING ||
          this.currentAuthenticationState == AuthenticationStates.OCR
        ) {
          this.handleDeviceVerificationProcess();
        }

        if (this.currentAuthenticationState == AuthenticationStates.OCR) {
          this.applyOCRProcess();
        }
      }
    }, 1000);
  }

  async applyOCRProcess() {
    this.imageProcessingService.requestOCR();

    console.log(this.currentAuthenticationState);
    //call api to make ocr
    const { reading_detected, reading } =
      await this.imageProcessingService.getOCRResults();

    console.log(`reading: ${reading}, reading_detected:${reading_detected}`);

    if (reading_detected) {
      this.imageProcessingService.setTakenReading(reading);
      this.imageProcessingService.closeSocketConnection();
      this.router.navigate(['/success']);
    } else console.log('No reading: ' + reading);
  }

  onTakeMyReadingClicked() {
    this.currentAuthenticationState = AuthenticationStates.OCR;
    this.isOCRRunning = true;
  }

  async handleDeviceVerificationProcess() {
    const { device_detected } =
      await this.imageProcessingService.getDeviceVerification();

    if (!device_detected) {
      this.deviceNotDetectedCount++;
      console.log('deviceWarningCOunt: ' + this.deviceNotDetectedCount);
      if (
        this.deviceNotDetectedCount > this.maxDeviceWarnings &&
        !this.isTestingPhase
      ) {
        this.closeSession(
          true,
          'Device Was not detected during the whole session '
        );
      }

      this.showDeviceNotDetectedMessage = true;
      if (this.isFaceDetected) this.alertMessage = 'Thermometer is not found';
    } else {
      this.showDeviceNotDetectedMessage = false;
    }
  }

  async handleIdentityVerificationProcess() {
    const {
      verified,
      distance,
      face_detected,
      facesCount,
      frame_number,
      spoofing_detected,
    } = await this.imageProcessingService.getVerificationMessage();
    this.isFaceDetected = face_detected;

    // if (spoofing_detected && frame_number <= this.currentFrameNumber) {
    //   // i made frame number greater than 2 to handle errors coming out of previous session and also give the user a space of error of two seconds maximum
    //   // may be we need to clear socket cache before starting a new session
    //   this.alertMessage =
    //     'Spoofing is un forgiveable, Your session is terminated';
    //   this.showErrorMessage = true;
    //   //this.closeSession(true, this.alertMessage);
    // }

    if (verified && facesCount === 1) {
      if (this.isFirstTrueVerificationOccured == false) {
        this.currentAuthenticationState = AuthenticationStates.DEVICE_SHOWING;
        this.isFirstTrueVerificationOccured = true;
      }
      this.showErrorMessage = false;
    } else if (!face_detected) {
      this.alertMessage =
        'You Should be infront of the Camera and in clear view during the session';
      this.handleFaceFalseVerifications();
    } else if (facesCount > 1) {
      this.alertMessage = 'You Should be Alone in the session';
      this.handleFaceFalseVerifications();
    } else if (!verified && face_detected) {
      this.alertMessage = 'You are not matching user data';
      this.handleFaceFalseVerifications();
    } else {
      console.log('fine');
    }
  }

  triggerSnapshot(): void {
    this.trigger.next(0);
  }
  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  closeSession(isWrongAction: boolean, message: string): void {
    this.imageProcessingService.closeSocketConnection();

    this.router.navigate([
      '/session-closed',
      { wrongAction: isWrongAction, message: message },
    ]);
    if (isWrongAction) alert('Session is Terminated');
  }

  handleFaceFalseVerifications() {
    this.showErrorMessage = true;
    this.unVerifiedCount++;
    console.log('unverified count ', this.unVerifiedCount);

    if (this.unVerifiedCount > this.maxFaceWarnings && !this.isTestingPhase) {
      this.closeSession(true, 'You are not verified against user data');
    }
  }

  isReadyToVerify() {
    return this.imageProcessingService.isConnected;
  }
}
