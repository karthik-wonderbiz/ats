import json
import cv2
import os
import requests
import numpy as np
import pickle
import time
from datetime import datetime
from fastapi import FastAPI, Form, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import face_recognition
import random
from config import cameraType, waitTime, apiBaseUrl, detectMultipleface
import io
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import base64
from signalrcore.hub_connection_builder import HubConnectionBuilder
import logging
from contextlib import asynccontextmanager


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to hold known face data
known_face_id, known_face_names, known_face_encodings = [], [], []

# Directory to save unknown faces
unknown_faces_dir = "unknown_faces"
if not os.path.exists(unknown_faces_dir):
    os.makedirs(unknown_faces_dir)

# List to track recently detected unknown faces
recent_unknown_faces = []
recent_detection_interval = 30  # seconds

last_attendance_time = {}

# Directory for storing images
IMAGES_PATH = 'images/'

class FaceDetectionResponse(BaseModel):
    attendance: List[dict]  
    image_base64: str

# Load known encodings from the api
def load_encodings_from_db():
    api_url = f"{apiBaseUrl}/employeedetail/face-encoding"
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        employees = response.json()
        filtered_employees = [emp for emp in employees if emp.get('faceEncoding')]  
        user_ids = [emp['userId'] for emp in filtered_employees]
        names = [emp['firstName'] for emp in filtered_employees]
        encodings = [pickle.loads(base64.b64decode(emp['faceEncoding'])) for emp in filtered_employees]        
        return user_ids, names, encodings
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from API: {e}")
        return [], [], []

#Unkown Face 
def is_recently_detected(face_encoding):
    current_time = time.time()
    for recent_face in recent_unknown_faces:
        recent_encoding, recent_time = recent_face
        if face_recognition.compare_faces([recent_encoding], face_encoding, tolerance=0.3)[0]:
            if current_time - recent_time < recent_detection_interval:
                return True
    return False

# Face Detection function
def detect_known_faces(known_face_id, known_face_names, known_face_encodings, frame, cameraType):
    apiUrl = apiBaseUrl + "/attendanceLog/multiple"
    data_list= []
    def mark_attendance(d):
        print("before", d)
        x = requests.post(url=apiUrl,json=d)
        response = x.json()
        return response 
    # Convert the frame from BGR to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Detect face locations and encodings
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    face_names = []
    response = []
    detected_id = None  # Initialize detected_id to None
    current_time = time.time()
    
    if detectMultipleface:
        for i, face_encoding in enumerate(face_encodings):
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"
            print("multiple")
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            print(known_face_id[-1],known_face_names[-1])
            print(face_distances[best_match_index])
            if matches[best_match_index] and face_distances[best_match_index] < 0.32:
                name = known_face_names[best_match_index]
                detected_id = known_face_id[best_match_index]
                if name not in last_attendance_time or (current_time - last_attendance_time[name]) > waitTime:
                    last_attendance_time[name] = current_time
                    data_list.append({
                        "UserId": detected_id,
                        "AttendanceLogTime": datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%fZ'),
                        "CheckType": cameraType
                    })  # Append the dictionary
                else:
                    name = "Unknown"
                    detected_id = None
            else:
                unknown_face_filename = os.path.join(unknown_faces_dir, f"unknown_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}.png")
                cv2.imwrite(unknown_face_filename, frame[face_locations[i][0]:face_locations[i][2], face_locations[i][3]:face_locations[i][1]])
            face_names.append(name)
    else:
        if face_encodings:
            print("single")
            face_encoding = face_encodings[0]
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            if matches[best_match_index] and face_distances[best_match_index] < 0.32:
                print(face_distances[best_match_index])
                detected_id = known_face_id[best_match_index]
                name = known_face_names[best_match_index]
                if name not in last_attendance_time or (current_time - last_attendance_time[name]) > waitTime:
                    last_attendance_time[name] = current_time
                    response.append(mark_attendance(detected_id))  # Append the dictionary
            else:
                # Save the unknown face
                unknown_face_filename = os.path.join(unknown_faces_dir, f"unknown_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}.png")
                cv2.imwrite(unknown_face_filename, frame[face_locations[0][0]:face_locations[0][2], face_locations[0][3]:face_locations[0][1]])

            face_names.append(name)
    attendance =mark_attendance(data_list)
    return face_locations, face_names, attendance

# Capture Image endpoint
@app.post("/capture-image/")
async def capture_image(file: UploadFile = File(...), employee_id: str = Form(...)):
    person_dir = os.path.join(IMAGES_PATH, str(employee_id))
    os.makedirs(person_dir, exist_ok=True)

    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{random.randint(1,9999)}.jpg"
    img_path = os.path.join(person_dir, filename)
    cv2.imwrite(img_path, img)

    return {"status": "Image saved", "image_path": img_path}

# Save the captured image face encodings
@app.post("/save-encoding/")
async def save_encoding(employee_id: str = Form(...)):
    person_dir = os.path.join(IMAGES_PATH, str(employee_id))
    img_paths = [os.path.join(person_dir, fname) for fname in os.listdir(person_dir) if fname.endswith('.jpg')]

    if not img_paths:
        raise HTTPException(status_code=400, detail="No images found for encoding!")

    encodings = []
    for img_path in img_paths:
        img = cv2.imread(img_path)
        if img is not None:
            rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img_encodings = face_recognition.face_encodings(rgb_img)
            if img_encodings:
                encodings.append(img_encodings[0])
                os.remove(img_path) 

    if encodings:
        avg_encoding = np.mean(encodings, axis=0)
        serialized_encoding = pickle.dumps(avg_encoding)
        base64_encoding = base64.b64encode(serialized_encoding).decode('utf-8')
        payload = {
            "faceEncoding":base64_encoding
        }
        api_url = f"{apiBaseUrl}/employeedetail/{employee_id}" 

        response = requests.put(api_url, json=payload)
        response.raise_for_status() 
        
        if response.status_code == 200:
            return {"status": "success", "message": "Face encoding saved!"}
        else:
            return {"status": "error", "message": f"Failed to save face encoding. Error: {response.text}"}
        

        return {"status": "success", "message": "Face encoding saved!"}
    else:
        raise HTTPException(status_code=400, detail="No faces detected in the images!")
    


@app.on_event("startup")
async def startup_event():
    global known_face_id, known_face_names, known_face_encodings
    # Load the initial encodings from the database
    known_face_id, known_face_names, known_face_encodings = load_encodings_from_db()
    # Connect to SignalR hub and listen for updates
    hub_connection = HubConnectionBuilder().with_url("http://192.168.29.46:5000/atsHub").configure_logging(logging.CRITICAL)\
    .with_automatic_reconnect({
        "type": "raw",
        "keep_alive_interval": 10,
        "reconnect_interval": 5,
        "max_attempts": 5
    }).build()
    
    def on_encodings_updated(data):
        try:
            user_id = data[1]
            name = data[2]
            encoding = pickle.loads(base64.b64decode(data[-1]))  # Ensure this matches the expected format

            print(f"User ID: {user_id}")
            print(f"Name: {name}")
            print(f"Encoding: {encoding}")

            if user_id in known_face_id:
                index = known_face_id.index(user_id)
                known_face_names[index] = name
                known_face_encodings[index] = encoding
                print(f"Updated encoding for user {user_id}.")
            else:
                known_face_id.append(user_id)
                known_face_names.append(name)
                known_face_encodings.append(encoding)
                print(f"Added new encoding for user {user_id}.")
        except Exception as e:
            print(f"Error in processing encodings: {e}")


    def on_delete_user_update(data):
        global known_face_id, known_face_names, known_face_encodings
        user_id = data[0]
        print(f'user_id: {user_id}')
        # Find the index of the user_id to delete
        if user_id in known_face_id:
            index = known_face_id.index(user_id)

            # Remove the user's data from all lists
            known_face_id.pop(index)
            known_face_names.pop(index)
            known_face_encodings.pop(index)
            print(f"User {user_id} removed successfully.")
        else:
            print(f"User {user_id} not found.")



    hub_connection.on("ReceiveUpdateEncoding", on_encodings_updated)
    hub_connection.on("DeleteUserUpdate", on_delete_user_update)

    hub_connection.on_open(lambda: print("connection opened and handshake received ready to send messages"))
    hub_connection.on_close(lambda: print("connection closed"))
    hub_connection.start()


@app.post("/mark-attendance/IN")
async def mark_attendance(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # known_face_id, known_face_names, known_face_encodings = load_encodings_from_db()
    face_locations, face_names, attendance = detect_known_faces(known_face_id, known_face_names, known_face_encodings, frame,"IN")

    # Draw the boundary box and label for each detected face
    for (top, right, bottom, left), name in zip(face_locations, face_names):
        color = (0, 255, 0) if name != 'Unknown' else (0, 0, 255)
        cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
        cv2.putText(frame, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.75, color, 2)

    # Convert the processed frame to a base64-encoded JPEG image
    _, img_encoded = cv2.imencode('.jpg', frame)
    img_bytes = io.BytesIO(img_encoded.tobytes())
    img_base64 = base64.b64encode(img_bytes.getvalue()).decode('utf-8')
    print(known_face_encodings[-1])

    # Create the response model
    response_data = FaceDetectionResponse(
        attendance=attendance,
        image_base64=img_base64,
    )

    return JSONResponse(content=response_data.model_dump())

@app.post("/mark-attendance/OUT")
async def mark_attendance(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # known_face_id, known_face_names, known_face_encodings = load_encodings_from_db()
    face_locations, face_names, attendance = detect_known_faces(known_face_id, known_face_names, known_face_encodings, frame,"OUT")

    # Draw the boundary box and label for each detected face
    for (top, right, bottom, left), name in zip(face_locations, face_names):
        color = (0, 255, 0) if name != 'Unknown' else (0, 0, 255)
        cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
        cv2.putText(frame, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.75, color, 2)

    # Convert the processed frame to a base64-encoded JPEG image
    _, img_encoded = cv2.imencode('.jpg', frame)
    img_bytes = io.BytesIO(img_encoded.tobytes())
    img_base64 = base64.b64encode(img_bytes.getvalue()).decode('utf-8')

    # Create the response model
    response_data = FaceDetectionResponse(
        attendance=attendance,
        image_base64=img_base64,
    )

    return JSONResponse(content=response_data.model_dump())
