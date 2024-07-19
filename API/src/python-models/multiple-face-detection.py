from deepface import DeepFace
import os
import sys,json
from pathlib import *
import cv2
import numpy as np


# image_to_be_verified=str(sys.argv[2])
path="C:/Users/zeyad/Desktop/call-in-sick/api/src/python-models/"
image_to_be_verified=str(sys.argv[1])
try:
    faces=DeepFace.extract_faces(os.path.join(path,image_to_be_verified),enforce_detection=False)
    json_data=json.dumps({
        'facesCount':len(faces)

    })
    print(json_data,flush=True,end='')

except :
   json_data=json.dumps({
        'facesCount':0

    })
   print(json_data,flush=True,end='')