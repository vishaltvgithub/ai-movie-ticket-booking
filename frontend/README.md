# 🎬 CineAI Frontend — React + Vite Cinema Application

This is the frontend client for the **AI Movie Ticket Booking Assistant (CineAI)** built using **React 19**, **Vite**, and custom **Glassmorphism CSS3**.

---

## 🌐 Live Application
- **Live Deployed App**: **[https://ai-movie-ticket-booking-4.onrender.com](https://ai-movie-ticket-booking-4.onrender.com)**
- **GitHub Repository**: **[https://github.com/vishaltvgithub/ai-movie-ticket-booking](https://github.com/vishaltvgithub/ai-movie-ticket-booking)**

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Create a `.env` file in this directory or use the default:
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Available Scripts

- **`npm run dev`**: Starts the local development server with Hot Module Replacement (HMR).
- **`npm run build`**: Builds the production-ready application to the `dist` folder.
- **`npm run preview`**: Locally previews the production build.
- **`npm run lint`**: Runs Oxlint for fast static analysis.

---

## 📂 Key Features & Pages
- **`Home.jsx`**: Hero search, live cinema dashboard statistics, movie categories.
- **`Movies.jsx`**: Filterable movie catalog (genre, language, rating).
- **`MovieDetails.jsx`**: Movie synopsis, cast, director, multiplex showtime picker.
- **`SeatSelection.jsx`**: Cinema matrix, curved screen, and **AI Best Seat Suggestion** engine.
- **`Checkout.jsx` & `Payment.jsx`**: Simulated checkout with QR/UPI, cards, and wallet options.
- **`BookingConfirmation.jsx`**: Digital E-Ticket pass with QR code and PDF print.
- **`AIChatbot.jsx`**: Floating CineAI conversational assistant.
