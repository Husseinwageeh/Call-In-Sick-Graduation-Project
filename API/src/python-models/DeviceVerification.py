from ultralytics import YOLO
import sys,json;
import os;
path="C:/Users/zeyad/Desktop/call-in-sick/api/users-data/"
yolo_weights_path="C:/Users/zeyad/Desktop/call-in-sick/api/src/python-models"

model=YOLO(os.path.join(yolo_weights_path,"yolo_weights/best.pt"))
image_to_be_verified=str(sys.argv[1])
device_to_be_recognized=str(sys.argv[2])

supported_devices={
    'thermometer':['thermometer-body','thermometer-screen'],

}

tracker_file=sys.argv[3]
old_frame_number='-1'
def read_input():
    file= open(os.path.join(path,tracker_file),encoding='utf8',errors='ignore')
    return file.read()

device_counts=0
device_detected=False
objects_detected=[]


while True:

  frame_number=read_input()
   
  if frame_number !=old_frame_number:
    device_detected=False
    device_screen_detected=False
    device_counts=0
    objects_detected=[]
    objects_captured_names=[]

    try:

        results=model(os.path.join(path,image_to_be_verified),stream=True,verbose=False)
        for result in results:

            objects_captured_ids=result.boxes.cls.tolist()
           
            for id in objects_captured_ids:
               objects_captured_names.append(result.names[id])
            
            if  supported_devices[device_to_be_recognized][0] in objects_captured_names and supported_devices[device_to_be_recognized][1] in objects_captured_names: 
                # print('entered')
                device_detected=True
                device_counts+=1
                objects_detected=supported_devices[device_to_be_recognized]
              
        json_object=json.dumps({
                
            "device_detected":device_detected,
            "device_counts":device_counts,
            "objects_detected":objects_detected
            #is_fake_device?:boolean later 
               
                }) 
       
    except Exception as e:
        # print(e)
      
        
        json_object=json.dumps({
                
            "device_detected":False,
            "device_counts":0,
            "objects_detected":[]
            #is_fake_device?:boolean later 
                }) 
        

    old_frame_number=frame_number
    print(json_object,flush=True,end='')     