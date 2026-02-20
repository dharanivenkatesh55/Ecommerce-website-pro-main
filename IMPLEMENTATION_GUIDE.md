
# E-Commerce Project Implementation Guide

Follow these steps exactly to get your full-stack application running.

## Phase 1: Database Setup (Crucial First Step)
1. Open **XAMPP Control Panel** and start **Apache** and **MySQL**.
2. Go to your browser and open `http://localhost/phpmyadmin`.
3. Click **New** in the sidebar.
4. Name the database `ecommerce` and click **Create**.
5. Click the **Import** tab at the top.
6. Click **Choose File** and select `database/schema.sql` from your project folder.
7. Click **Import** at the bottom to create all tables (users, products, categories, etc.).

## Phase 2: Start the Backend Server
1. Open a new terminal.
2. Navigate to the backend folder:
   ```powershell
   cd backend
   ```
3. Install dependencies (if you haven't already):
   ```powershell
   npm install
   ```
4. Start the server:
   ```powershell
   npm run dev
   ```
   *You should see: `Server running on port 5000`*

## Phase 3: Start the Frontend Application
1. Open a **second** terminal (keep the first one running).
2. Navigate to the frontend folder:
   ```powershell
   cd frontend
   ```
3. Install dependencies (if you haven't already):
   ```powershell
   npm install
   ```
4. Start the Vite server:
   ```powershell
   npm run dev
   ```
5. Open the link shown (usually `http://localhost:5173`) in your browser.

## Phase 4: Testing the Application
1. **Admin Registration (Postman/Thunder Client)**:
   - Since the Admin UI isn't fully built yet, use Postman to create your first Admin user.
   - **POST** `http://localhost:5000/api/auth/register`
   - Body (JSON):
     ```json
     {
       "name": "Admin User",
       "email": "admin@example.com",
       "password": "adminpassword",
       "role": "admin"
     }
     ```
2. **Login**:
   - **POST** `http://localhost:5000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "admin@example.com",
       "password": "adminpassword"
     }
     ```
   - Copy the `token` from the response.

## Next Steps for Development (What to build next)
1. **Complete Admin Dashboard (`frontend/src/pages/AdminDashboard.tsx`)**:
   - Create forms to add Categories and Products.
   - Use the `api.ts` service to send data to the backend.
   - example: `api.post('/categories', { name: 'Men' })`.
2. **Add Authentication Context**:
   - Store the JWT token in `localStorage` upon login.
   - Redirect users if they are not logged in.

Your backend is fully capable of handling Products, Categories, and Authentication now.
