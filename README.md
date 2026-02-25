# Premium Rental Application

A modern, highly responsive, and accessible rental application built with Vanilla HTML, CSS, and JavaScript, backed by a lightweight Python and SQLite server.

## Features
*   **Modern Soft UI Design:** Clean, professional aesthetic with responsive grid layouts, custom radio toggle pills, and clear focus states.
*   **Dynamic Sections:** Dynamically add previous residential history blocks or expand explanation fields based on user input.
*   **Multi-step Form Flow:** A seamless 5-step application process with built-in form validation.
*   **Serverless Backend:** Uses standard Python 3 libraries (`http.server` and `sqlite3`) to save application data locally without needing heavy frameworks like Node.js or external database servers.

---

## Local Deployment & Running Instructions

### Prerequisites
The only software required to run this application is **Python 3**. 
*   *Note: If you are on macOS or Linux, Python 3 is typically already installed. You can check by running `python3 --version` in your terminal.*

### Step 1: Download or Clone the Project
Ensure you have the project files downloaded to your local machine (e.g., in `/Users/vn58osw/Desktop/Antigravity/rental-app`).

### Step 2: Start the Backend API Server
The backend server handles saving the application data to a local database (`rentals.db`).
1. Open your terminal application.
2. Navigate to the project directory:
   ```bash
   cd /Users/vn58osw/Desktop/Antigravity/rental-app
   ```
3. Run the Python server script:
   ```bash
   python3 server.py
   ```
   *You should see a message saying: `Rental Application API Server running on port 3000`*

### Step 3: Start the Frontend Web Server
Leave the first terminal running. We need to serve the HTML, CSS, and JS files so your browser can read them.
1. Open a **new, second terminal window/tab**.
2. Navigate to the project directory again:
   ```bash
   cd /Users/vn58osw/Desktop/Antigravity/rental-app
   ```
3. Start Python's built-in HTTP server:
   ```bash
   python3 -m http.server 8080
   ```
   *You should see a message saying: `Serving HTTP on :: port 8080 ...`*

### Step 4: Access the Application
1. Open your preferred web browser (Chrome, Safari, Firefox, etc.).
2. Navigate to the following URL:
   👉 **http://localhost:8080**

You can now fill out the application. When you click "Submit Application" on the final step, the data will be sent to the backend server and saved locally in the `rentals.db` SQLite file.
