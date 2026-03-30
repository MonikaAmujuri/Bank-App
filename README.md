# Bank Loan Management System

A full-stack web application designed to simplify the loan application and management process for customers, agents, and administrators. The system provides separate dashboards for each role and supports loan creation, document handling, profile management, user management, status tracking, and dashboard analytics.

This project is structured as a multi-app repository with dedicated frontend applications and a centralized backend API.

---

## Project Structure

The repository is organized into the following main modules:

- `bank-backend/` – Central backend API built with Node.js, Express, and MongoDB
- `bank-customer/` – Customer portal for applying for and tracking loans
- `bank-admin/` – Admin dashboard for managing users, agents, loans, and system settings
- `bank-agent/` – Agent dashboard for handling assigned users and loan processing

---

## Tech Stack


### Backend

- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT and bcryptjs
- File Uploads: Multer
- API Style: REST API
- Other Packages: CORS, dotenv, cookie-parser, Firebase Admin
- Development Tooling: Nodemon

### Frontend

- Framework: React
- Build Tool: Vite
- Routing: React Router DOM
- Styling: Tailwind CSS / Custom CSS
- Routing: React Router DOM
- State Management: Context API
- Charts & UI: Recharts / premium dashboard components

---

## API Documentation

Detailed API documentation for each module can be found here:

- [Admin API](./ADMIN_API.md)
- [Agent API](./AGENT_API.md)
- [Customer API](./CUSTOMER_API.md)

## Getting Started
### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB local instance or MongoDB Atlas

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/MonikaAmujuri/Bank-App.git
cd bank-app
```

#### 2. Setup the backend
```bash
cd bank-backend
npm install
```
### 3. Run the backend server:
```bash
npm run dev
```
#### 4. Setup the admin dashboard
```bash
cd bank-admin
npm install
npm run dev
```
#### 4. Setup the agent dashboard
```bash
cd bank-agent
npm install
npm run dev
```
#### 4. Setup the customer portal
```bash
cd bank-customer
npm install
npm run dev
```