#Backend API - Documentation
This is the backend service for managing forms, user authentication, and form submissions. It is built using Node.js and Express.js, with a structured MVC architecture.

📂 Project Structure
```
src/
│── controllers/         # Route handlers (business logic)
│   ├── form.controller.js
│   ├── formSubmission.controller.js
│   ├── healthcheck.controller.js
│   ├── user.controller.js
│
│── db/                  # Database configuration
│   ├── index.js
│
│── middlewares/         # Middleware (e.g., authentication)
│   ├── auth.middleware.js
│
│── models/              # Database models (Schemas)
│   ├── form.model.js
│   ├── formSubmission.model.js
│   ├── user.model.js
│
│── routes/              # API Routes
│   ├── form.routes.js
│   ├── formSubmission.routes.js
│   ├── healthcheck.routes.js
│   ├── user.routes.js
│
│── utils/               # Helper functions & error handling
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   ├── app.js
│   ├── constants.js
│   ├── index.js
│
├── .env                 # Environment variables
├── package.json         # Dependencies & scripts
├── README.md            # Documentation
```
```
🚀 Getting Started

1️⃣ Prerequisites
Install Node.js (v16+ recommended)
Install MongoDB (if using a local database)

2️⃣ Installation
Clone the repository:
git clone https://github.com/your-username/your-repo.git
cd your-repo
Install dependencies:
npm install

3️⃣ Environment Setup
Rename .env.sample to .env and update your configurations:

cp .env.sample .env
Edit the .env file with:
PORT=8000
MONGODB_URI=mongodb+srv://{username}:{password}@cluster0.ip1lv.mongodb.net
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=//data-collection-app
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=//data-collection-app
REFRESH_TOKEN_EXPIRY=10d

4️⃣ Running the Server
Start the development server:
npm run dev

📡 API Routes

Health Check
GET /api/health - Check if the server is running
Auth Routes
POST /api/users/register - Register a user
POST /api/users/login - Authenticate user
Form Routes
POST /api/forms - Create a new form
GET /api/forms - Get all forms
GET /api/forms/:id - Get form by ID
PUT /api/forms/:id - Update form
DELETE /api/forms/:id - Delete form
Form Submissions
POST /api/forms/:id/submit - Submit a form
GET /api/forms/:id/submissions - Get form submissions

🛠 Technologies Used
Node.js - JavaScript runtime
Express.js - Backend framework
MongoDB & Mongoose - Database & ORM
JWT - Authentication
Zod - Input validation
Dotenv - Environment management
Prettier - Code formatting

📜 License
This project is licensed under the MIT License.
```
