export interface VerificationMessage {
  verified: boolean;
  face_detected: boolean;
  facesCount: number;
  distance: number;
  frame_number:number;
  spoofing_detected:boolean;
}
