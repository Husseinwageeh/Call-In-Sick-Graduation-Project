
from deepface import DeepFace
import os;
import sys,json;
from pathlib import *;
import urllib.request
import json
import pickle
from ultralytics import YOLO
import torch



face_detected=False
reference_image=str(sys.argv[1])
image_to_be_verified=str(sys.argv[2])
frame_number=int(sys.argv[3])
path="C:/Users/zeyad/Desktop/call-in-sick/api/users-data/"

models = ["VGG-Face", "Facenet", "OpenFace", "DeepFace", "DeepID", "Dlib", "ArcFace"]
metrics = ["cosine", "euclidean", "euclidean_l2"]
detectors = ["opencv", "ssd", "mtcnn", "dlib", "retinaface"]


while True:
    

        try:


            faces=DeepFace.extract_faces(os.path.join(path,image_to_be_verified),enforce_detection=False)
            verification=DeepFace.verify(os.path.join(path,reference_image),os.path.join(path,image_to_be_verified),model_name='ArcFace',detector_backend='ssd')
            json_object=json.dumps({
                "verified":bool(verification['verified']), 
                "distance":verification['distance'],
                "face_detected":True,
                'facesCount':len(faces),
                "frame_number":frame_number
            })
            
            
        except : 

            json_object=json.dumps({
                    "verified":False, 
                    "face_detected":False     ,
                    "facesCount":0,
                    "frame_number":frame_number
                })
            


        print(json_object,flush=True,end='') 
