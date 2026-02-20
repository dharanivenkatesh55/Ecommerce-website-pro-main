# E-Commerce Web Application

## Requirements
- Node.js
- MySQL (XAMPP or standalone server)

## Installation Guide

### 1. Database Setup
1. Start XAMPP MySQL.
2. Create a database named `ecommerce`.
3. Import `database/schema.sql` into the `ecommerce` database using phpMyAdmin or MySQL Workbench.
   - Alternatively: `mysql -u root -p ecommerce < database/schema.sql`

### 2. Backend Setup
1. Open terminal in `backend/` folder.
2. Run `npm install` to install dependencies.
3. Configure `.env` file with your database credentials (default: localhost, root, empty password).
4. Run `npm run dev` to start the backend server (default: http://localhost:5000).

### 3. Frontend Setup
1. Open terminal in `frontend/` folder.
2. Run `npm install` to install dependencies.
3. run `npm run dev` to start the frontend development server (default: http://localhost:5173).

## Features Implemented
- **Backend:** Node.js + Express + MySQL + Sequelize (setup ready).
- **Frontend:** React + TypeScript + Tailwind CSS via Vite.
- **Database:** schema.sql provided.
- **Project Structure:**
  - `backend/src`: Controllers, Routes, Models
  - `frontend/src`: Components, Pages, Services, Hooks, Types
