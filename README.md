# Cotton Health AI & Automated Spray System 🌿🚜

An end-to-end AIoT solution for precision agriculture. This system identifies cotton plant diseases using Deep Learning and automatically calculates and triggers insecticide/pesticide spraying via a mini-car hardware controller.

## 🚀 System Architecture
1. **Mobile App (Expo/React Native):** Captures/uploads plant images and provides manual override for the sprayer.
2. **AI Server (FastAPI/Python):** Processes images using a **FastAI** model to classify plant health and calculate required spray duration.
3. **Database (Firebase Realtime):** Acts as the bridge between the mobile app and the physical hardware.
4. **Hardware (Mini-Car/ESP32):** Listens for signals from Firebase and operates the spray pump for the calculated duration.

## 🛠 Tech Stack
- **AI/ML:** Python, FastAI, PyTorch
- **Backend:** FastAPI (Python), Uvicorn
- **Mobile:** React Native (Expo), TypeScript, Expo Router
- **Database:** Firebase Realtime Database

## 📁 Project Structure
```text
Cotton Plant Disease/
├── cotton-disease-server/    # Python FastAPI Backend
│   ├── app.py                # Main server logic
│   ├── export.pkl            # Trained FastAI model
│   └── requirements.txt      # Python dependencies
└── cotton-mobile-app/        # Expo/React Native App
    ├── app/                  # Expo Router screens
    └── constants/            # Config files (Firebase)
```



#### - Update the ip to your current ip in cotton-mobile-app/app/analysis.tsx

#### - Add the pkl model from https://www.kaggle.com/code/aehtajaz/cotton-classification-using-fasi-ai and put it in cotton-disease-server folder and rename it to export.pkl 

### AI Server

    Navigate to cotton-disease-server/.

    Install dependencies: pip install -r requirements.txt.

    Run the server: python app.py.

    The server runs on port 8000.

### Mobile App

    Navigate to cotton-mobile-app/.

    Install dependencies: npm install.

    Update constants/firebaseConfig.js with your Firebase credentials.

    Run: npx expo start.