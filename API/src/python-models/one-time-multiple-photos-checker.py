
from deepface import DeepFace
import os;
import sys,json;
from pathlib import *;

import json




     

face_detected=False
user_data_file=str(sys.argv[1])

path="C:/Users/zeyad/Desktop/call-in-sick/api/users-data/"+user_data_file

models = ["VGG-Face", "Facenet", "OpenFace", "DeepFace", "DeepID", "Dlib", "ArcFace"]
metrics = ["cosine", "euclidean", "euclidean_l2"] 
detectors = ["opencv", "ssd", "mtcnn", "dlib", "retinaface"]

# images= [ for imageFileName in os.listdir(path) ]
images=[]

front_id_image=''

for imageFileName in os.listdir(path):

    if((imageFileName.endswith('.jpg') or imageFileName.endswith('.png') or imageFileName.endswith('.jpeg') ) ):
        
        if not imageFileName.startswith('front-id') :
            images.append(imageFileName)
        else:
            front_id_image=imageFileName

json_object=json.dumps({
                'photosMatching':True,
        
                'face_detected':True,
                'image_not_matching':0,##means no image matching

            })

for i, image in enumerate(images):

    
    try:
        
    
        result=DeepFace.verify(os.path.join(path,front_id_image),os.path.join(path,image),model_name='ArcFace',detector_backend='ssd')
        if(result['verified']!=True):
            json_object=json.dumps({
                'photosMatching':False,
                'image_not_matching':i+1,## order of image not matching from 1
                'face_detected':True,
               

            })
            break



    except:

        json_object=json.dumps({
                
                'photosMatching':False,
                'face_detected':False,
                'image_not_matching':i+1
                
            })
        break


print(json_object,flush=True,end='') 
