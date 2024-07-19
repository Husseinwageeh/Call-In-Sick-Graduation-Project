
import json
from pathlib import Path
import cv2
from screeninfo import get_monitors
import cv2
import numpy as np
import concurrent.futures
import subprocess
import os
import re
from PIL import Image, ImageEnhance, ImageFilter
from google.cloud import vision
from google.oauth2 import service_account
import sys

def enhance_image2(input_path, output_path, option):
    # Open the image
    img = cv2.imread(input_path)

    if option == 1:
        # Option 1: Increase Brightness
        enhanced_img = ImageEnhance.Brightness(Image.fromarray(img)).enhance(1.5)

    elif option == 2:
        # Option 2: Increase Contrast
        enhanced_img = ImageEnhance.Contrast(Image.fromarray(img)).enhance(1.5)

    elif option == 3:
        # Option 3: Apply Gaussian Blur
        enhanced_img = Image.fromarray(cv2.GaussianBlur(img, (5, 5), 0))

    elif option == 4:
        # Option 4: Convert to Grayscale
        enhanced_img = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY))

    elif option == 5:
        # Option 5: Apply Sharpening
        kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
        enhanced_img = Image.fromarray(cv2.filter2D(img, -1, kernel))

    elif option == 6:
        # Option 7: Sepia Tone Effect
        sepia_matrix = np.array([[0.393, 0.769, 0.189],
                                [0.349, 0.686, 0.168],
                                [0.272, 0.534, 0.131]])
        sepia_img = cv2.transform(img, sepia_matrix)
        enhanced_img = Image.fromarray(sepia_img)


    elif option == 7:
        # Option 9: Invert Colors
        enhanced_img = Image.fromarray(cv2.bitwise_not(img))

    elif option == 8:
        # Option 10: Cartoonize Effect
        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blur_img = cv2.medianBlur(gray_img, 5)
        edges = cv2.adaptiveThreshold(blur_img, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 9)
        color_img = cv2.bilateralFilter(img, 9, 300, 300)
        enhanced_img = Image.fromarray(cv2.bitwise_and(color_img, color_img, mask=edges))

    elif option == 9:
        # Option 11: Pencil Sketch Effect
        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        inverted_img = cv2.bitwise_not(gray_img)
        blurred_img = cv2.GaussianBlur(inverted_img, (111, 111), 0)
        inverted_blurred_img = cv2.bitwise_not(blurred_img)
        pencil_sketch_img = cv2.divide(gray_img, inverted_blurred_img, scale=256.0)
        enhanced_img = Image.fromarray(pencil_sketch_img)

    elif option == 10:
        # Option 12: Warm Filter
        warming_matrix = np.array([[1.0, 0.0, 0.0],
                                  [0.0, 0.8, 0.0],
                                  [0.0, 0.0, 0.6]])
        warm_img = cv2.transform(img, warming_matrix)
        enhanced_img = Image.fromarray(warm_img)

    elif option == 11:
        # Option 14: Blur
        enhanced_img = Image.fromarray(cv2.GaussianBlur(img, (15, 15), 0))

    elif option == 12:
        # Option 17: Cool Filter
        cooling_matrix = np.array([[0.6, 0.0, 0.0],
                                   [0.0, 1.0, 0.0],
                                   [0.0, 0.0, 1.0]])
        cool_img = cv2.transform(img, cooling_matrix)
        enhanced_img = Image.fromarray(cool_img)

    elif option == 13:
        # Option 18: Vintage Effect
        vintage_matrix = np.array([[0.5, 0.5, 0.0],
                                   [0.5, 0.5, 0.0],
                                   [0.0, 0.0, 0.8]])
        vintage_img = cv2.transform(img, vintage_matrix)
        enhanced_img = Image.fromarray(vintage_img)

    elif option == 14:
        # Option 19: Neon Glow Effect
        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, neon_mask = cv2.threshold(gray_img, 200, 255, cv2.THRESH_BINARY_INV)
        neon_img = cv2.bitwise_and(img, img, mask=neon_mask)
        enhanced_img = Image.fromarray(neon_img)

    else:
        print("Invalid option. Please choose a number from 1 to 14.")
        return

    # Save the enhanced image
    enhanced_img.save(output_path)

def enhance_image(input_path, output_path):
    # Open the image
    img = Image.open(input_path)

    # Increase brightness
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(1.5)  # Adjust the factor as needed

    # Increase contrast
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(2)  # Adjust the factor as needed

    # Increase sharpness
    img = img.filter(ImageFilter.SHARPEN)

    # Increase saturation (optional)
    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(1.7)  # Adjust the factor as needed

    # Save the enhanced image
    img.save(output_path)
def Crop_AND_Enhance(input_image_path, output_image_path):
    # Read the input image
    image = cv2.imread(input_image_path)

    # Convert the image from BGR to HSV color space
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Define the range of green color in HSV
    lower_green = np.array([40, 40, 40])
    upper_green = np.array([80, 255, 255])

    # Create a mask for the green color
    mask = cv2.inRange(hsv, lower_green, upper_green)

    # Find contours in the mask
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Get the largest contour (assumed to be the green box)
    if contours:
        largest_contour = max(contours, key=cv2.contourArea)

        # Get the bounding box of the green box
        x, y, w, h = cv2.boundingRect(largest_contour)

        # Crop the image to keep only the content within the green box
        cropped_image = image[y:y+h, x:x+w]

        # Convert the cropped image to grayscale
        grayscale_image = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)

        # Save the grayscale cropped image
        cv2.imwrite(output_image_path+"enhanced_image_option_15.jpg", grayscale_image)
       # print("Grayscale cropped image saved successfully.")
    # else:
    #     print("No green box found in the image.")
    output_path = "enhanced_image_option_16.jpg"
    enhance_image(input_image_path, output_image_path+output_path)
    for i in range(1, 15):
        output_path = f"enhanced_image_option_{i}.jpg"
        enhance_image2(input_image_path,output_image_path + output_path, i)

# Example usage


def process_string(input_str):
    # Remove existing dots
    input_str = input_str.replace('.', '')

    # Add dot after the first two numbers and keep only one digit after the dot
    result = input_str[:2] + '.' + input_str[2:3]
    if(float(result)>50):
         result += '°F'
    else:
    # Add degree Celsius symbol
        result += '°C'



    if len(result) != 6:
        result=""
    return result
def extract_temperature(text):
    # Regular expression to find numeric values (including decimal points)
    temperature_match = re.search(r'\d+(\.\d+)?', text)
    if temperature_match:

        return process_string(temperature_match.group())
    return None

def  ocr_image(image_path, credentials_path):
    credentials = service_account.Credentials.from_service_account_file(credentials_path)
    client = vision.ImageAnnotatorClient(credentials=credentials)
 
    with open(image_path, 'rb') as image_file:
        content = image_file.read()
 
    image = vision.Image(content=content)
    response =  client.text_detection(image=image)
    texts = response.text_annotations
 
    if texts:
        # Extracting temperature from the first text annotation
        temperature = extract_temperature(texts[0].description)
        return temperature
 
    return None
def solve(image_path,credentials_path):
 
 
    temp_map={}
    for i in range(1,17): 
        image_path2 = image_path+"enhanced_image_option_"+str(i)+".jpg"
        filePath=Path(image_path2)
        if(filePath.exists()):
            result = ocr_image(image_path2, credentials_path)
            if result:
                temperature = int(result[:2])
                if 32 <= temperature <= 142:
                    if result not in temp_map:
                        temp_map[result] = 1
                    else:
                        temp_map[result] += 1
            # print("Temperature:", result)
 
 
        # print("------------------------")
    # Find the key with the highest frequency
    if(not temp_map):
        return 0
 
    most_frequent_key = max(temp_map, key=temp_map.get)
    return most_frequent_key 

    most_frequent_key = max(temp_map, key=temp_map.get)
    return most_frequent_key
def read_input():
    file= open(os.path.join(users_data_path,tracker_file),encoding='utf8',errors='ignore')
  
    return file.read()
def read_ocr_signal_file():
      ocr_signal_file=open(os.path.join(users_data_path,ocr_file),encoding='utf8',errors='ignore')
      return ocr_signal_file.read()




image_to_be_verified=str(sys.argv[1])
 
credentials_path = "C:/Users/zeyad/Desktop/call-in-sick/API/src/python-models/boreal-quarter-428218-n4-d02a66cb32e0.json"


tracker_file=sys.argv[2]
ocr_file=sys.argv[3]
user_directory=sys.argv[4]
users_data_path=f'C:/Users/zeyad/Desktop/call-in-sick/api/users-data/'
input_image_path = os.path.join(users_data_path, image_to_be_verified)
output_image_path=os.path.join(users_data_path,user_directory)

old_frame_number='-1'


output_image_path+='/'

# test_photo="C:/Users/zeyad/Desktop/OCR V.3/captured_photo.jpg"
while(True):
 

        frame_number=read_input()
        ocr_ready=read_ocr_signal_file()
        result=0

         

        if  frame_number !=old_frame_number and ocr_ready !='0':
            try:
                    old_frame_number=frame_number     


                    
               

                    Crop_AND_Enhance(input_image_path, output_image_path)
                                

                    result=solve(output_image_path,credentials_path)
              
               
                    if(not result):
                        json_object=json.dumps({
                                    
                                "reading_detected":False,
                                "reading":0,
                                'error':False

                                    }) 
                    else:
                        json_object=json.dumps({
                            'reading':result,
                            'reading_detected':True,
                            'error':False

                        })    


            # print (json_object,flush=True,end='' ) 
            except Exception as e:

                # if not result:
                #     result=0
       
                json_object=json.dumps({
                        'reading':result,
                        'reading_detected':False,
                        'error':True,

                    })    
                # raise e
  
            print (json_object,flush=True,end='' )