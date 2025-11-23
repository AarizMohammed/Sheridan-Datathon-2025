from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.cluster import DBSCAN
from fastapi.middleware.cors import CORSMiddleware
from math import radians, sin, cos, sqrt, atan2
import joblib

app = FastAPI()

# Allow all origins (for local testing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -----------------------------------------------------
# LOAD MODEL + VULNERABILITY DATA (ONLY ONCE)
# -----------------------------------------------------
model_loaded = joblib.load("pedestrian_risk_model.pkl")
vul_df = pd.read_csv("vulnerable_hotspots_final.csv")


# -----------------------------------------------------
# Haversine Distance
# -----------------------------------------------------
def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

# -----------------------------------------------------
# Risk Prediction Function
# -----------------------------------------------------
def predict_risk(lat, lon):
    # Distance to every hotspot
    distances = vul_df.apply(
        lambda row: haversine_km(lat, lon, row["LAT_WGS84"], row["LONG_WGS84"]),
        axis=1
    )

    # Find nearest hotspot row
    nearest_idx = distances.idxmin()
    nearest = vul_df.loc[nearest_idx]

    # Model feature order
    feature_order = list(model_loaded.feature_names_in_)

    # Build sample input for model
    sample = pd.DataFrame([{
        "LAT_WGS84": lat,
        "LONG_WGS84": lon,
        "collision_count": nearest["collision_count"],
        "severity_score": nearest["severity_score"]
    }])[feature_order]

    # Predict
    risk = model_loaded.predict(sample)[0]

    # Extra info (optional)
    info = {
        "nearest_cluster": int(nearest["cluster"]),
        "nearest_lat": float(nearest["LAT_WGS84"]),
        "nearest_lon": float(nearest["LONG_WGS84"]),
        "nearest_severity_score": float(nearest["severity_score"]),
        "nearest_collision_count": int(nearest["collision_count"]),
        "distance_km_to_nearest": float(distances.min())
    }

    return risk, info


# -----------------------------------------------------
# Request body format for predict_risk()
# -----------------------------------------------------
class LocationRequest(BaseModel):
    lat: float
    lon: float


# -----------------------------------------------------
# EXISTING CLUSTERING ENDPOINT
# -----------------------------------------------------
@app.get("/MIPA")
def test():
    jsonData = [
        {"cluster":5,"collision_count":3198,"neighbourhoods":["Wellington Place (164)","Kensington-Chinatown (78)","Yonge-Bay Corridor (170)","Trinity-Bellwoods (81)","West Queen West (162)","Harbourfront-CityPlace (165)"]},
        {"cluster":29,"collision_count":2518,"neighbourhoods":["Yonge-Bay Corridor (170)","Downtown Yonge East (168)","Moss Park (73)","St Lawrence-East Bayfront-The Islands (166)","Regent Park (72)"]},
        {"cluster":153,"collision_count":2277,"neighbourhoods":["Downtown Yonge East (168)","Bay-Cloverhill (169)","Church-Wellesley (167)","Annex (95)","Yonge-Bay Corridor (170)","Rosedale-Moore Park (98)","Moss Park (73)"]},
        {"cluster":64,"collision_count":1160,"neighbourhoods":["Roncesvalles (86)","Little Portugal (84)","Trinity-Bellwoods (81)","South Parkdale (85)","West Queen West (162)"]},
        {"cluster":154,"collision_count":985,"neighbourhoods":["South Parkdale (85)"]},
        {"cluster":243,"collision_count":909,"neighbourhoods":["Forest Hill North (102)","Humewood-Cedarvale (106)","Briar Hill-Belgravia (108)","Oakwood Village (107)","Forest Hill South (101)"]},
        {"cluster":96,"collision_count":872,"neighbourhoods":["Church-Wellesley (167)","Downtown Yonge East (168)","North St.James Town (74)","Cabbagetown-South St.James Town (71)","Rosedale-Moore Park (98)","Moss Park (73)"]},
        {"cluster":111,"collision_count":817,"neighbourhoods":["Leaside-Bennington (56)","North Toronto (173)","Mount Pleasant East (99)","Bridle Path-Sunnybrook-York Mills (41)","South Eglinton-Davisville (174)","Yonge-Eglinton (100)"]},
        {"cluster":168,"collision_count":804,"neighbourhoods":["Yonge-Bay Corridor (170)","Kensington-Chinatown (78)"]},
        {"cluster":14,"collision_count":729,"neighbourhoods":["Yonge-Doris (151)","Avondale (153)","Lansing-Westgate (38)","Willowdale West (37)"]}
    ]
    return jsonData


# -----------------------------------------------------
# NEW: RISK PREDICTION API ENDPOINT
# -----------------------------------------------------
@app.post("/PIGC")
def predict_endpoint(req: LocationRequest):
    risk, info = predict_risk(req.lat, req.lon)
    return {
        "input_coordinates": {"lat": req.lat, "lon": req.lon},
        "risk_level": risk,
        "nearest_hotspot_info": info
    }

@app.get("/predict_risk_get")
def predict_risk_get(lat: float, lon: float):
    risk, info = predict_risk(lat, lon)
    return {
        "input_coordinates": {"lat": lat, "lon": lon},
        "risk_level": risk,
        "nearest_hotspot_info": info
    }

@app.get("/")
def onTest():
    return("Hello")