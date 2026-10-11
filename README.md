# 🎬 Movie Ticket Booking App

A full-stack movie ticket booking web application built with React, Node.js, Express, and MongoDB.

## 🌐 Live Links

- **Frontend:** [https://movie-ticket-booking-app-tau.vercel.app/](https://movie-ticket-booking-app-tau.vercel.app/)
- **Backend API:** [https://movie-ticket-booking-app-5ui.vercel.app/](https://movie-ticket-booking-app-5ui.vercel.app/)

---

## ✨ Features

- 🎟️ Browse currently showing and upcoming movies
- 🪑 Interactive seat selection and real-time booking
- 💳 Secure online payments integrated with Stripe
- 🔐 User authentication powered by Clerk
- 📧 Email notifications and booking confirmations via Nodemailer
- 📱 Modern, responsive UI styled with Tailwind CSS

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router, Clerk
- **Backend:** Node.js, Express, MongoDB (Mongoose), Stripe, Cloudinary, Inngest
- **DevOps & Cloud:** Docker, Kubernetes, Jenkins, Vercel

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas or local MongoDB instance
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rathaur-ankit/movie-ticket-booking-app.git
   cd movie-ticket
   ```

2. **Frontend Setup:**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

3. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   npm start
   ```

---

## 📁 Project Structure

```
movie-ticket/
├── Frontend/           # React client application
├── Backend/            # Express server application
├── K8s/                # Kubernetes deployment manifests
├── infra/              # Infrastructure configuration
├── docker-compose.yaml # Docker Compose configuration
└── Jenkinsfile         # CI/CD pipeline definition
```

---

## 📄 License

This project is licensed under the MIT License.
