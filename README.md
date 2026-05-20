# 💊 ABC Pharmacy — Medicine Tracker

A full-stack Pharmacy Medicine Tracker web application built with **React** (Vite) and **ASP.NET Core 9**. Manage medicine inventory, track expiry dates, and record sales — all in one place.

![.NET](https://img.shields.io/badge/.NET-9.0-purple)
![React](https://img.shields.io/badge/React-19-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

---

## ✨ Features

- **Medicine Management** — Add, search, and delete medicines
- **Expiry Alerts** — Highlights medicines expiring within 30 days
- **Low Stock Alerts** — Flags medicines with quantity < 10
- **Sales Recording** — Sell medicines with automatic stock deduction
- **Sales Dashboard** — View total sales, units sold, and revenue

---

## 🏗️ Architecture

```
┌────────────────────────────────┐
│     React Frontend (Vite)      │
│  Medicines | Add | Sales       │
└───────────────┬────────────────┘
                │ REST API (/api/*)
┌───────────────▼────────────────┐
│    ASP.NET Core 9 Backend      │
│  Controllers → Services → JSON │
└───────────────┬────────────────┘
                │
┌───────────────▼────────────────┐
│      JSON File Storage         │
│  medicines.json | sales.json   │
└────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer       | Technology            |
|-------------|-----------------------|
| Frontend    | React 19, Vite        |
| Backend     | ASP.NET Core 9 (C#)   |
| Storage     | JSON files            |
| Deployment  | Docker, Render.com    |

---

## 📁 Project Structure

```
PharmacyApp/
├── Controllers/              # API endpoints
│   ├── MedicinesController.cs
│   └── SalesController.cs
├── Models/                   # Data models
│   ├── Medicine.cs
│   └── SaleRecord.cs
├── Services/                 # Business logic
│   └── JsonDataService.cs
├── Data/                     # JSON data storage
│   ├── medicines.json
│   └── sales.json
├── pharmacy-frontend/        # React source code
│   └── src/
│       ├── App.jsx
│       └── components/
│           ├── Medicines.jsx
│           ├── AddMedicine.jsx
│           └── Sales.jsx
├── wwwroot/                  # Built React output
├── Program.cs                # App configuration
├── Dockerfile                # Multi-stage Docker build
└── PharmacyApp.csproj        # .NET project file
```

---

## 🚀 Getting Started

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 18+](https://nodejs.org/)

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/saujanyamahajan/PharmacyApp.git
cd PharmacyApp

# 2. Build the React frontend
cd pharmacy-frontend
npm install
npm run build
cd ..

# 3. Run the .NET backend
dotnet run
```

Open **http://localhost:5119** in your browser.

### Development Mode (Hot Reload)

```bash
# Terminal 1 — .NET backend
dotnet run

# Terminal 2 — React dev server (proxies API to :5119)
cd pharmacy-frontend
npm run dev
```

Access the dev server at **http://localhost:5173**.

---

## 🔌 API Endpoints

| Method | Route                       | Description              |
|--------|-----------------------------|--------------------------|
| GET    | `/api/medicines`            | List all medicines       |
| GET    | `/api/medicines?search=xyz` | Search by name           |
| GET    | `/api/medicines/{id}`       | Get medicine by ID       |
| POST   | `/api/medicines`            | Add a new medicine       |
| DELETE | `/api/medicines/{id}`       | Delete a medicine        |
| GET    | `/api/sales`                | List all sales           |
| POST   | `/api/sales`                | Record a sale            |

### Example — Record a Sale

```json
POST /api/sales
{
  "medicineId": "22222222-2222-2222-2222-222222222222",
  "quantity": 5
}
```

---

## 🐳 Docker

```bash
# Build the image
docker build -t pharmacy-app .

# Run the container
docker run -p 10000:10000 pharmacy-app
```

Access at **http://localhost:10000**

### Multi-Stage Build

1. **Stage 1 (Node)** — Builds React frontend
2. **Stage 2 (.NET SDK)** — Publishes .NET app
3. **Stage 3 (.NET Runtime)** — Lightweight production image

---

## ☁️ Deployment (Render.com)

1. Push code to GitHub
2. Create a **New Web Service** on [render.com](https://render.com)
3. Connect your GitHub repo
4. Set **Language** → **Docker**
5. Leave **Root Directory** empty
6. Click **Deploy**

Auto-deploys on every push to `main`.

---

## 📜 License

This project is for educational/assignment purposes.

---

## 👤 Author

**Saujanya Mahajan**  
GitHub: [@saujanyamahajan](https://github.com/saujanyamahajan)
