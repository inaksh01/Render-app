from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import os
import gdown
import cv2
from ultralytics import YOLO

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

MODEL_URL = "https://drive.google.com/uc?id=18O0SvhxoP1hCWkRUPUKsDR1E2bCPLVMR"

model = YOLO("best.pt")  # ensure best.pt is mounted or in working dir

@app.post("/detect/")
async def detect(file: UploadFile = File(...)):
    img_bytes = await file.read()
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    results = model.predict(img)
    dets = []
    for box in results[0].boxes:
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        conf = float(box.conf[0])
        cls = int(box.cls[0])
        dets.append({"x1": x1, "y1": y1, "x2": x2, "y2": y2, "confidence": conf, "class_id": cls})
    return {"detections": dets, "names": results[0].names}
