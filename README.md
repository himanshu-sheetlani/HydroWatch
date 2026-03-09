# HydroWatch: IoT-Based Water Quality Monitoring System

HydroWatch is a comprehensive IoT-based solution designed to monitor, analyze, and report on water quality in real time. The project integrates hardware sensors with a robust backend and a modern front-end dashboard, allowing users to track vital water parameters effectively.

**Live Demo:** [hydrowatch.vercel.app](https://hydrowatch.vercel.app)

## 🌟 Features

- **Real-Time Monitoring**: Live data tracking of essential water parameters including pH, Total Dissolved Solids (TDS), temperature, and turbidity.
- **IoT Integration**: Arduino/ESP-based hardware layer that directly interfaces with Firebase to store sensor readings.
- **Smart Analytics**: Backend powered by Node.js and Google GenAI to provide intelligent insights and analysis of water quality data.
- **Interactive Dashboard**: A responsive, dynamic frontend built with React, Vite, TailwindCSS, and GSAP, featuring interactive charts (Recharts, React Gauge Chart) and 3D visual elements (React Three Fiber).
- **Automated Alerts**: Scheduled monitoring and email notifications using Node-cron and Nodemailer.

## 🏗️ Project Structure

The repository is divided into three main components:

- `/IoT`: Contains the C++/Arduino firmware (`.ino` files) for interfacing with sensors (pH, TDS, Temperature, Turbidity) and connecting to Firebase.
- `/backend`: Node.js Express server that handles data processing, GenAI integration (via `@google/genai`), and cron jobs for automated tasks and email alerts.
- `/client`: The React frontend ("hydrowatch") showcasing real-time data visualisations and modern UI.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Arduino IDE (for IoT firmware)
- Hardware components: ESP32, pH sensor, TDS sensor, Temperature sensor, Turbidity sensor
- Firebase Project setup with Realtime Database

### 1. IoT Hardware Setup

1. Open the `/IoT` folder in the Arduino IDE.
2. Install the necessary libraries for your board and sensors (e.g., Firebase ESP Client).
3. Update `firebaseDB.ino` and header files (`tttHeader.h`) with your WiFi credentials and Firebase database URL/secret.
4. Flash the code to your microcontroller.

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure your environment variables:
   - Firebase Admin SDK credentials
   - Google Gemini API key
   - Nodemailer/SendGrid credentials
4. Start the server (using nodemon for development):
   ```bash
   nodemon index.js
   # or
   node index.js
   ```

### 3. Client Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file containing your Firebase frontend configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   # ...
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠️ Technology Stack

- **IoT**: C/C++, Arduino Framework
- **Backend**: Node.js, Express, Firebase Admin, Google Generative AI, Nodemailer/mailjet, node-cron
- **Frontend**: React, Vite, Tailwind CSS, Zustand, Recharts, React-Three-Fiber, GSAP
- **Database**: Firebase Database

## 📄 License

This project is licensed under the ISC License.
