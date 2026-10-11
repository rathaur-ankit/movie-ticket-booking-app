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
   cd movie-ticket-booking-app
   ```

2. **Configure Environment Variables:**
   Copy the example environment files and update them with your credentials:
   ```bash
   # Root / Docker Compose environment file
   cp .env.example .env

   # Frontend environment file
   cp Frontend/.env.example Frontend/.env

   # Backend environment file
   cp Backend/.env.example Backend/.env
   ```

3. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   npm start
   ```

4. **Frontend Setup:**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

### 🐳 Running with Docker Compose

Alternatively, you can run the entire stack using Docker Compose:

```bash
# Ensure .env and Backend/.env are configured
cp .env.example .env
cp Backend/.env.example Backend/.env

docker compose up --build
```

---

## 🔑 Environment Variables

The project requires environment variables for authentication, database access, payments, and external services. Templates are provided via `.env.example` files (real `.env` files are gitignored for security).

### Frontend Variables (`Frontend/.env` or root `.env` for Docker)

| Variable | Description | Example / Default |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for client authentication | `pk_test_...` |
| `VITE_CURRENCY` | Currency symbol displayed across the UI | `$` |
| `VITE_BASE_URL` | Base URL of the backend API | `http://localhost:5000` |
| `VITE_TMDB_IMAGE_BASE_URL` | Base URL for fetching TMDB movie posters and images | `https://image.tmdb.org/t/p/original` |

### Backend Variables (`Backend/.env`)

| Variable | Description | Example / Default |
|---|---|---|
| `PORT` | Port number on which the Express server listens | `5000` |
| `MONGO_URI` | MongoDB connection URI | `mongodb://localhost:27017` |
| `CORS_ORIGIN` | Allowed CORS origins | `*` |
| `CLIENT_URL` | Frontend application URL (used for Stripe redirect URLs) | `http://localhost:5173` |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk secret key for backend verification | `sk_test_...` |
| `INNGEST_EVENT_KEY` | Inngest event key for background event processing | `sk-inn-...` |
| `INNGEST_SIGNING_KEY` | Inngest signing key for webhook validation | `signkey-...` |
| `TMDB_API_KEY` | TMDB API Read Access Token / API key | `your_tmdb_api_key` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |
| `STRIPE_SECRET_KEY` | Stripe secret key for payment processing | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` |
| `SENDER_EMAIL` | Sender email address for nodemailer booking notifications | `your_email@example.com` |
| `SMTP_USER` | SMTP username for email delivery | `your_smtp_username` |
| `SMTP_PASS_KEY` | SMTP password / app password for email delivery | `your_smtp_password` |

---

## 📁 Project Structure

```
movie-ticket-booking-app/
├── Frontend/           # React client application
│   ├── .env.example    # Frontend environment template
│   └── ...
├── Backend/            # Express server application
│   ├── .env.example    # Backend environment template
│   └── ...
├── K8s/                # Kubernetes deployment manifests
├── infra/              # Infrastructure configuration
├── .env.example        # Root / Docker Compose environment template
├── docker-compose.yaml # Docker Compose configuration
└── Jenkinsfile         # CI/CD pipeline definition
```

---

## 📄 License

This project is licensed under the MIT License.
