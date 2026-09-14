const form = document.getElementById("predictionForm");
const predictBtn = document.getElementById("predictBtn");
const errorBox = document.getElementById("errorBox");
const resultCard = document.getElementById("resultCard");
const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const resetBtn = document.getElementById("resetBtn");
const weekendToggle = document.getElementById("weekendToggle");
const weekendText = document.getElementById("weekendText");
const isWeekend = document.getElementById("isWeekend");

weekendToggle.addEventListener("change", () => {
  isWeekend.value = weekendToggle.checked ? "1" : "0";
  weekendText.textContent = weekendToggle.checked ? "Weekend" : "Weekday";
});

function showError(message) {
  errorBox.textContent = message;
  errorBox.style.display = "block";
}

function hideError() {
  errorBox.textContent = "";
  errorBox.style.display = "none";
}

function getPayload() {
  const data = new FormData(form);
  return {
    Avg_VTAT: Number(data.get("Avg_VTAT")),
    Avg_CTAT: Number(data.get("Avg_CTAT")),
    Booking_Value: Number(data.get("Booking_Value")),
    Ride_Distance: Number(data.get("Ride_Distance")),
    Vehicle_Type: data.get("Vehicle_Type"),
    Top_Drop_Location: data.get("Top_Drop_Location"),
    Top_Pickup_Location: data.get("Top_Pickup_Location"),
    Payment_Method: data.get("Payment_Method"),
    Driver_Ratings: Number(data.get("Driver_Ratings")),
    Customer_Rating: Number(data.get("Customer_Rating")),
    Hour: Number(data.get("Hour")),
    Day: Number(data.get("Day")),
    Month: Number(data.get("Month")),
    Weekday: Number(data.get("Weekday")),
    Customer_Total_Bookings: Number(data.get("Customer_Total_Bookings")),
    Is_Weekend: Number(data.get("Is_Weekend"))
  };
}

function validatePayload(payload) {
  const checks = [
    ["Avg_VTAT", payload.Avg_VTAT >= 0, "Average VTAT cannot be negative."],
    ["Avg_CTAT", payload.Avg_CTAT >= 0, "Average CTAT cannot be negative."],
    ["Booking_Value", payload.Booking_Value > 0, "Booking value must be greater than 0."],
    ["Ride_Distance", payload.Ride_Distance >= 0, "Ride distance cannot be negative."],
    ["Driver_Ratings", payload.Driver_Ratings >= 0 && payload.Driver_Ratings <= 5, "Driver rating must be between 0 and 5."],
    ["Customer_Rating", payload.Customer_Rating >= 0 && payload.Customer_Rating <= 5, "Customer rating must be between 0 and 5."],
    ["Hour", payload.Hour >= 0 && payload.Hour <= 23, "Hour must be between 0 and 23."],
    ["Day", payload.Day >= 1 && payload.Day <= 31, "Day must be between 1 and 31."],
    ["Month", payload.Month >= 1 && payload.Month <= 12, "Month must be between 1 and 12."],
    ["Weekday", payload.Weekday >= 0 && payload.Weekday <= 6, "Weekday must be between 0 and 6."],
    ["Customer_Total_Bookings", payload.Customer_Total_Bookings >= 0, "Customer bookings cannot be negative."]
  ];
  const failed = checks.find(x => !x[1]);
  return failed ? failed[2] : null;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideError();

  if (!form.checkValidity()) {
    form.reportValidity();
    showError("Please complete all required fields with valid values.");
    return;
  }

  const payload = getPayload();
  const validationError = validatePayload(payload);
  if (validationError) {
    showError(validationError);
    return;
  }

  predictBtn.disabled = true;
  predictBtn.classList.add("loading");

  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error(`Server returned HTTP ${response.status}.`);
    }

    if (!response.ok) {
      const detail = Array.isArray(data.detail)
        ? data.detail.map(item => item.msg).join(" ")
        : (data.detail || `Request failed with HTTP ${response.status}.`);
      throw new Error(detail);
    }

    const status = data.predicted_uber_ride_status;
    resultCard.classList.remove("cancel");

    if (status === "Cancel") {
      resultCard.classList.add("cancel");
      resultIcon.textContent = "⚠";
      resultTitle.textContent = "Ride likely to be cancelled";
      resultMessage.textContent = "The model predicts that this ride may be cancelled.";
    } else {
      resultIcon.textContent = "✓";
      resultTitle.textContent = "Ride likely to continue";
      resultMessage.textContent = "The model predicts that the customer will not cancel.";
    }

    resultCard.classList.add("show");
    resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    showError(
      error.message.includes("Failed to fetch")
        ? "Unable to connect to the FastAPI server. Make sure uvicorn is running on port 2200."
        : error.message
    );
  } finally {
    predictBtn.disabled = false;
    predictBtn.classList.remove("loading");
  }
});

resetBtn.addEventListener("click", () => {
  form.reset();
  isWeekend.value = "0";
  weekendText.textContent = "Weekday";
  resultCard.classList.remove("show", "cancel");
  hideError();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
