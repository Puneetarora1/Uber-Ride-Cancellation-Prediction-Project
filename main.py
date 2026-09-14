from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import pandas as pd
from pydantic import BaseModel, Field
from typing import Literal
import joblib
from fastapi.middleware.cors import CORSMiddleware


# 1
COLUMNS = ['Avg VTAT', 'Avg CTAT', 'Booking Value', 'Ride Distance', 'Vehicle Type',
 'top_drop_location', 'top_pickup_location', 'Payment Method', 'Driver Ratings',
 'Customer Rating', 'hour', 'day', 'month', 'weekday', 'customer_total_bookings',
 'is_weekend']

output_label = ["Don't Cancel", "Cancel"]

# 2
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("uber_ml_pipeline.pkl")

#2. Pydantic Model
# the input validation
class Features(BaseModel):
    Avg_VTAT: float = Field(..., ge=0)
    Avg_CTAT: float = Field(..., ge=0)
    Booking_Value: float = Field(..., gt=0)
    Ride_Distance: int = Field(..., ge=0, description="Total distance of ride")
    Vehicle_Type: Literal['eBike', 'Go Sedan', 'Auto', 'Premier Sedan', 'Bike', 'Go Mini',
       'Uber XL']
    Top_Drop_Location: Literal['Other', 'Narsinghpur', 'Cyber Hub', 'Nehru Place',
       'Basai Dhankot', 'Ashram', 'Lajpat Nagar', 'Udyog Vihar',
       'Kalkaji', 'Lok Kalyan Marg', 'Kashmere Gate ISBT']
    Top_Pickup_Location: Literal['Other', 'Khandsa', 'AIIMS', 'Madipur', 'Pragati Maidan',
       'Mehrauli', 'Dwarka Sector 21', 'Barakhamba Road', 'Saket',
       'Badarpur', 'Pataudi Chowk']
    Payment_Method: Literal['missing', 'UPI', 'Debit Card', 'Cash', 'Uber Wallet',
       'Credit Card']
    Driver_Ratings: float = Field(..., ge=0, le=5)
    Customer_Rating: float = Field(..., ge=0, le=5)
    Hour : int = Field(..., ge=0, le=23, description="Hour of Booking")
    Day : int = Field(..., ge=1, le=31)
    Month : int = Field(..., ge=1, le=12)
    Weekday : int = Field(..., ge=0, le=6, description="Mon[0]-Sun[6]")
    Customer_Total_Bookings : int = Field(..., ge=0, description="No of Booking by Customer[1 if first]")
    Is_Weekend : int = Field(..., ge=0, le=1, description="0 if weekday, 1 if weekend on Booking day")

# output validation
class PredictionResponse(BaseModel):
    predicted_uber_ride_status: str

app.mount('/static', StaticFiles(directory="static"), name="static")

@app.get('/', include_in_schema=False)
def server_ui():
    return FileResponse("static/index.html")

@app.post('/predict', response_model=PredictionResponse)
def predict(features: Features):
    
    input_row = pd.DataFrame([features.dict()], columns=COLUMNS)
    
    prediction  = model.predict(input_row)

    return PredictionResponse(predicted_uber_ride_status=output_label[prediction[0]])