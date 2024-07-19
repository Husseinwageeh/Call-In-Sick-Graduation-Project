export interface DeviceVerificationMessage{
    device_detected:boolean,
    device_counts:number,
    is_fake_device?:boolean
}