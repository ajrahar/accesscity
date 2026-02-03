# AccessCity 🏙️♿

**AccessCity** is a comprehensive inclusive navigation prototype designed to empower people with disabilities (PWDs) to navigate urban environments safely and independently.

Unlike standard map apps, AccessCity prioritizes **accessibility variables** such as surface type, path width, and elevation, offering personalized routing for wheelchair users, the visually impaired, and the elderly.

---

## 🌟 Key Features

### 1. Advanced Navigation 🧭
- **Turn-by-Turn Instructions**: Clear, step-by-step guidance (e.g., "Go along Jendral Sudirman").
- **Voice Command Support 🎤**: Hands-free operation. Just say "Ke Malioboro" to set your destination.
- **Personalized Mobility Profiles ♿**:
  - **Wheelchair**: Avoids steep slopes (>5%) and stairs.
  - **Cane / Elderly**: Minimizes walking distance.
  - **Visual Impairment**: Prioritizes simple, straight paths and safe crossings.

### 2. Safety & Community 🛡️
- **Emergency SOS Button 🆘**: Instantly broadcast your location to the backend system (Prototype).
- **Obstacle Reporting ⚠️**: Users can report real-time hazards like construction debris, broken curbs, or flooding.
- **Weather Integration 🌤️**: Real-time mock weather updates to alert users of extreme heat or rain.

### 3. Data & Efficiency ⚡
- **Real-time Elevation Simulation**: Calculates route difficulty based on terrain grade.
- **Smart Route Caching**: Optimizes performance by storing frequently requested paths.

### 4. Next-Gen Visuals (Prototype) 🚀
- **AI Surface Analyzer 📷**: Upload a photo of a sidewalk to analyze its safety (Safe/Warning/Danger).
- **3D City Mode 🏙️**: Visualize building heights for better landmark recognition.
- **Indoor Navigation 🏢**: Overlay floor plans for malls and stations.
- **Multimodal Transit 🚌**: Integration with public bus stops and routes.

---

## 🛠️ Tech Stack

- **Frontend**: 
  - **React.js**: Core framework.
  - **OpenLayers**: Advanced mapping library for rendering vectors and tiles.
  - **Web Speech API**: For native voice recognition.
- **Backend**: 
  - **Python (FastAPI)**: High-performance API server.
  - **OSMnx & NetworkX**: For graph-based street network analysis.
  - **Scipy & Scikit-learn**: For spatial calculations and AI logic.
- **Infrastructure**: 
  - **Docker & Docker Compose**: Complete containerization.
  - **PostgreSQL + PostGIS**: Spatial database.
  - **GeoServer**: Map tile server.

---

## 🚀 Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/accesscity.git
   cd accesscity
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```
   *Note: The first build may take a few minutes.*

3. **Access the Application**
   - **Frontend Dashboard**: [http://localhost:8081](http://localhost:8081)
   - **Backend API**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **GeoServer**: [http://localhost:8080/geoserver](http://localhost:8080/geoserver)

---

## 📖 User Guide

### How to Navigate
1. **Choose Profile**: Open the Sidebar (Left) and select your mobility profile (Wheelchair, Cane, etc.).
2. **Set Route**: 
   - Type a location or click the **🎤 Microphone** button to speak.
   - Example: "Universitas Gadjah Mada" to "Tugu Yogyakarta".
3. **Follow Directions**: 
   - A green path will appear.
   - Use the **Step-by-Step Drawer** (Bottom Left) for text instructions.

### Community Actions
- **Report Hazard**: Saw a broken sidewalk? Click the Orange **⚠️ Button** (Bottom Right) to report it.
- **Check Safety**: Not sure if a path is safe? Click the Purple **📷 Camera Button** to let AI analyze it.
- **Emergency**: In danger? Press the Red **🆘 Button** to trigger a system alert.

### Visual Toggles
- Use the **White Floating Buttons** (Bottom Right stack) to toggle **3D Mode**, **Indoor Maps**, or **Transit Layers**.

---

## ⚠️ Prototype Note
This project is a high-fidelity prototype. Some features like **SOS SMS**, **Real-time Elevation**, and **AI Vision** currently use sophisticated mock logic/data for demonstration purposes. To go to production, these would need to be connected to live services (e.g., Twilio, SRTM DEM, TensorFlow Serving).

---

## 📄 License
This project is licensed under the MIT License.
