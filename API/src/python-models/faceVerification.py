
from deepface import DeepFace
import os;
import sys,json;
from pathlib import *;
# 


import json

face_detected=False
reference_image=str(sys.argv[1])
image_to_be_verified=str(sys.argv[2])
tracker_file=sys.argv[3]
user_directory_path=sys.argv[4]
# path=sys.argv[5]

user_extra_photos_prefix='personal-photo-'



path="C:/Users/zeyad/Desktop/call-in-sick/api/users-data/"




personal_photos_path=os.path.join(path,user_directory_path)
models = ["VGG-Face", "Facenet", "OpenFace", "DeepFace", "DeepID", "Dlib", "ArcFace"]
metrics = ["cosine", "euclidean", "euclidean_l2"]
detectors = ["opencv", "ssd", "mtcnn", "dlib", "retinaface"]
old_frame_number='-1'

def read_input():
    file= open(os.path.join(path,tracker_file),encoding='utf8',errors='ignore')
    return file.read()
images=[]


for imageFileName in os.listdir(os.path.join(path,user_directory_path)):
    if ( imageFileName.endswith('.jpg') or imageFileName.endswith('.png') or imageFileName.endswith('.jpeg') )  and (not imageFileName.startswith('image') ):
        if not imageFileName.startswith('front-id') :
            images.append(imageFileName) 
          


while True:
    frame_number=read_input()
   
    if frame_number !=old_frame_number:

        try:

            faces=DeepFace.extract_faces(os.path.join(path,image_to_be_verified),enforce_detection=False,anti_spoofing=True)
            spoofing_detected=not all(face["is_real"] is True for face in faces)


            verification=DeepFace.verify(os.path.join(path,reference_image),os.path.join(path,image_to_be_verified),model_name='ArcFace',detector_backend='ssd')
    
            if( verification['verified']==False and len(faces)==1):
                for imageFileName in images:
                    verification=DeepFace.verify(os.path.join(path,image_to_be_verified),os.path.join(personal_photos_path,imageFileName),model_name='ArcFace',detector_backend='ssd')
                    if(verification['verified']):
                        break
            f_num=int(frame_number)    
            json_object=json.dumps({
                "verified":bool(verification['verified']), 
                "distance":verification['distance'],
                "face_detected":True,
                'facesCount':len(faces),
                "frame_number":f_num,
                "spoofing_detected":spoofing_detected

            })

            
            
        except Exception as err  : 
      

            json_object=json.dumps({
                    "verified":False, 
                    "face_detected":False     ,
                    "facesCount":0,
                    "frame_number":-1,
                    "spoofing_detected":False
                })
            # raise err

        old_frame_number=frame_number
        print(json_object,flush=True,end='') 
