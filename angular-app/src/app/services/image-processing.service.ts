import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Socket } from 'ngx-socket-io';
import { WebcamImage } from 'ngx-webcam';
import { VerificationMessage } from '../models/VerificationMessage';
import { DeviceVerificationMessage } from '../models/DeviceVerificationMessage';
import { RegistrationService } from './registration.service';
import { AuthenticationService } from './authentication.service';
import { OCRMessage } from '../models/OCRMessage';

@Injectable({
  providedIn: 'root',
})
export class ImageProcessingService {
  imageFrame: any;
  io!: any;
  isConnected: boolean = false;
  currentFrame: number = 0;
  private readingTaken:string | number | undefined;


  constructor(
    private registrationService: RegistrationService,
    private authenticationService: AuthenticationService
  ) {}

  initiateSocketConnection() {
    this.io = io('http://localhost:3000', {
      transports: ['websocket'],
    });
    this.io.connect();

    this.io.emit('session-request-for-user', {
      email: this.authenticationService.getAuthenticatedUser()!.email,
    }); 

    this.io.on('session-request-accepted', (socket: Socket) => {
      this.io.sendBuffer = [];

      console.log('request-accepted');
      this.isConnected = true;
    });
  }

  sendImageToAPI(
    image: WebcamImage,
    currentState: number,
    frameNumber: number
  ) {
    this.io.emit('message', {
      imageFrame: image,
      currentState: currentState,
      frameNumber: frameNumber,
      email: this.authenticationService.getAuthenticatedUser()!.email,
    });
  }

  requestOCR(){
    this.io.emit('ocrRequest',{email:this.authenticationService.getAuthenticatedUser()!.email})
  }

  async getVerificationMessage(): Promise<VerificationMessage> {
    return new Promise<VerificationMessage>((resolve, reject) => {
      this.io.on('verificationMessage', (message: VerificationMessage) => {
        console.log(message, typeof message);
        this.currentFrame = message.frame_number;
        resolve(message);
      });
    });
  }

  async getDeviceVerification(): Promise<DeviceVerificationMessage> {
    return new Promise<DeviceVerificationMessage>((resolve, reject) => {
      this.io.on(
        'deviceVerificationMessage',
        (message: DeviceVerificationMessage) => {
          console.log(message, typeof message);
          resolve(message);
        }
      );
    });
  }

  async getOCRResults(): Promise<OCRMessage> {
    return new Promise<OCRMessage>((resolve, reject) => {
      this.io.on('ocrMessage', (message: OCRMessage) => {
        console.log('OCR OCR OCR')
        console.log(message, typeof message);
        resolve(message);
      });
    });
  }




  closeSocketConnection() {
    //this.io.emit('session-end');
    this.io.disconnect();
    this.isConnected = false;
    //clear socket buffer
  }


  public getTakenReading(){
    return this.readingTaken;

  }
  public setTakenReading(reading:string | number){
    this.readingTaken=reading;
  }




}
