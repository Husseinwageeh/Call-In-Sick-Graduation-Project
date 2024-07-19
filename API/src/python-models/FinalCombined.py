import cv2
from screeninfo import get_monitors
import cv2
import numpy as np
import subprocess
import os
import re
from PIL import Image, ImageEnhance, ImageFilter
from google.cloud import vision
from google.oauth2 import service_account
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
        cv2.imwrite(output_image_path, grayscale_image)
        print("Grayscale cropped image saved successfully.")
    else:
        print("No green box found in the image.")
    output_path = "enhanced_image_option_16.jpg"
    enhance_image(input_image_path, output_path)
    for i in range(1, 15):
        output_path = f"enhanced_image_option_{i}.jpg"
        enhance_image2(input_image_path, output_path, i)

# Example usage


def process_string(input_str):
    # Remove existing dots
    input_str = input_str.replace('.', '')

    # Add dot after the first two numbers and keep only one digit after the dot
    result = input_str[:2] + '.' + input_str[2:3]
    
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

def ocr_image(image_path, credentials_path):
    credentials = service_account.Credentials.from_service_account_file(credentials_path)
    client = vision.ImageAnnotatorClient(credentials=credentials)
    with open(image_path, 'rb') as image_file:
        content = image_file.read()
    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations
    return texts[0].description if texts else ''
def solve(image_path,credentials_path):
    temp_map={}
    for i in range(1,17): 
       
        result = ocr_image(image_path, credentials_path)
        if result:
            temperature = int(result[:2])
            if 32 <= temperature <= 42:
                if result not in temp_map:
                    temp_map[result] = 1
                else:
                    temp_map[result] += 1
            print("Temperature:", result)
        else:
            print("No temperature information found.")
        print("------------------------")
    # Find the key with the highest frequency
    most_frequent_key = max(temp_map, key=temp_map.get)
    return most_frequent_key
image_path ="C:/Users/zeyad/Desktop/call-in-sick/API/src/python-models/test-image.jpg"    
credentials_path = "C:/Users/zeyad/Desktop/call-in-sick/API/src/python-models/double-operator-406600-8e046b74a250.json"
input_image_path = "captured_photo.jpg"
output_image_path = "enhanced_image_option_15.jpg"
Crop_AND_Enhance(image_path, output_image_path)
# Print the result
print("The Temperature is :- ", solve(image_path,credentials_path))