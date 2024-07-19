 export enum AuthenticationStates{
    INITIAL_STATE=0,
    ID_SHOWING=1,
    DEVICE_SHOWING=2,
    OCR=3,
}

 export const authenticationStatesMessages = [
    'Hello,Stay in View to Verify',
    'Show Your Id',
    'Show Your Thermometer and Start Reading',
    'Show your thermometer in a clear view in the green box',
  ];
  
