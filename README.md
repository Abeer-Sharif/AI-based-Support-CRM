# AI-Powered Support CRM

Deployed Link : https://ai-based-support-crm-1.onrender.com

A full-stack customer support management system with **Role-Based Access Control (RBAC), secure authentication, AI-powered ticket triage, automated team routing, and agent assignment**.

The application helps support teams manage incoming customer requests while automatically analyzing each ticket for **category, priority, and sentiment**. Administrative actions such as viewing all tickets, changing ticket status, and assigning agents are protected through role-based authorization.

---

## 📸 Preview

<p align="center">
  <img
    src="https://github.com/user-attachments/assets/a569733f-db71-434f-8ac4-06058745e074"
    alt="AI-Powered Support CRM Dashboard"
    width="900"
  />
</p>

<p align="center">
  <img
    src="https://github.com/user-attachments/assets/6744e5fd-4078-4335-952d-b844db051fc5"
    alt="AI-Powered Support CRM Ticket Management"
    width="900"
  />
</p>

---

## ✨ Features

### Authentication & Authorization

* JWT-based user authentication
* Secure password hashing using bcrypt
* Role-Based Access Control (RBAC)
* Protected frontend routes
* Protected backend APIs
* Admin and Agent roles

### Ticket Management

* Create support tickets
* View ticket details
* Search and filter tickets
* Track ticket status
* Add internal notes
* Assign tickets to support agents
* Organize tickets by support team
* Automatic creation and update timestamps

### Support Ticket Dashboard

The application supports the core requirements of the technical assignment:

* Create tickets with title, description, customer email, priority, and status
* Search tickets by title/customer information
* Filter tickets by status
* Sort tickets by creation date
* View complete ticket details
* Update ticket status and priority
* Persist ticket updates in MongoDB
* Display ticket summary information
* Responsive interface for desktop and mobile

### Admin Controls

Admin users can:

* Access all support tickets
* Update ticket status
* Assign and reassign tickets to agents
* Manage support agents and teams
* View complete ticket information
* Add internal notes to tickets

Administrative operations are protected by backend authorization middleware and are not accessible to regular Agent users.

### AI-Powered Ticket Triage

When a new support ticket is created, the AI service analyzes its content and determines:

* **Category**
* **Priority**
* **Sentiment**
* **Responsible team**
* **Suitable ticket assignment**

Example:

```json
{
  "category": "Technical",
  "priority": "High",
  "sentiment": "Negative",
  "team": "Technical"
}
```

The classification results are used to automatically route incoming tickets to the appropriate support team and assist with agent assignment.

A fallback mechanism allows ticket creation to continue even when the AI service is temporarily unavailable.

---

## 🧠 AI Ticket Workflow

```text
Customer Creates Ticket
        ↓
Ticket Sent to Backend
        ↓
AI Triage Service
        ↓
┌───────────────────────────┐
│ Category                  │
│ Priority                  │
│ Sentiment                 │
│ Team                      │
└───────────────────────────┘
        ↓
Automatic Routing / Assignment
        ↓
Ticket Stored in MongoDB
        ↓
Admin Review & Management
```

---

## 🔐 Authorization Flow

```text
User Login
    ↓
Credentials Verified
    ↓
JWT Generated
    ↓
Token Sent With API Requests
    ↓
Authentication Middleware
    ↓
Role / Permission Check
    ↓
Authorized Resource Access
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Context API
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Joi

### AI

* Ollama
* Llama 3.2

### Testing

* Jest
* Supertest

### Deployment

* Render
* MongoDB Atlas

---

## 📂 Project Structure

```text
├── backend
│   ├── src
│   │   ├── controllers
│   │   │   ├── auth.js
│   │   │   └── ticket.js
│   │   ├── models
│   │   │   ├── notes.js
│   │   │   ├── tickets.js
│   │   │   └── user.js
│   │   ├── routes
│   │   │   ├── auth.js
│   │   │   └── ticket.js
│   │   └── services
│   │       └── aiTriage.js
│   ├── seed
│   │   └── tickets.js
│   ├── tests
│   │   └── ticket.test.js
│   ├── utils
│   │   └── ticketId.js
│   ├── middleware.js
│   ├── package-lock.json
│   ├── package.json
│   ├── schema.js
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── Navbar.jsx
│   │   │   ├── NoteList.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── StatusFilter.jsx
│   │   │   ├── TicketRow.jsx
│   │   │   └── TicketTable.jsx
│   │   ├── context
│   │   │   └── AuthContext.jsx
│   │   ├── pages
│   │   │   ├── Agents.jsx
│   │   │   ├── CreateTicket.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.css
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Ticket.css
│   │   │   └── TicketDetails.jsx
│   │   ├── services
│   │   │   ├── api.js
│   │   │   ├── authApi.js
│   │   │   ├── ticketApi.js
│   │   │   └── userApi.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd support-crm
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend` directory:

```env
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=your_backend_api_url
```

Do not commit `.env` files or sensitive credentials to GitHub.

---

## ▶️ Run Locally

### Start the Backend

```bash
cd backend
npm start
```

### Start the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend will run using the Vite development server and communicate with the configured backend API.

---

## 🌱 Seed Data

The project includes a seed script containing **25 sample support tickets** with varied statuses, priorities, categories, teams, and sentiments.

To populate the database:

```bash
cd backend
npm run seed
```

The seed script clears existing tickets and inserts the 25 sample tickets.

---

## 🧪 Automated Tests

The project includes automated backend tests using **Jest** and **Supertest**.

The tests cover:

1. **Validation**  
   Verifies that a ticket with an invalid customer email is rejected.

2. **Querying**  
   Verifies that ticket search returns tickets matching the requested search term.

3. **Ticket Updates**  
   Verifies that a ticket can be updated to `Resolved` and that the change persists.

Run the tests using:

```bash
cd backend
npm test
```

---

## 📌 Ticket Classification

Supported ticket categories include:

* Billing
* Technical
* Account
* Shipping
* Product
* Other

### Priority Levels

* Low
* Medium
* High

### Sentiment Levels

* Positive
* Neutral
* Negative

### Ticket Status

* Open
* In Progress
* Resolved

---

## 🧩 Technical Choices

### React + Vite

Used to build a responsive single-page frontend with reusable components and client-side routing.

### Node.js + Express

Used to provide REST API endpoints for authentication, ticket management, searching, filtering, and updates.

### MongoDB + Mongoose

Used for persistent storage of users, tickets, and internal notes.

### Joi + Mongoose Validation

Used to validate incoming data and maintain valid ticket values.

### Ollama + Llama 3.2

Used for AI-powered ticket classification and routing based on ticket content.

### Jest + Supertest

Used to automate backend tests for validation, querying, and ticket updates.

---

## ⚙️ Assumptions

* Authentication and RBAC from the existing application are retained.
* MongoDB is used as the persistent database.
* AI-generated category, priority, and sentiment are used for automatic ticket classification.
* Seed data is provided for demonstrating the ticket dashboard and testing functionality.
* The application is intended to run locally using the documented setup instructions.

---

## ⚠️ Known Limitations

* The AI triage service depends on the configured Ollama model being available.
* AI classification may fall back to default values if the AI service is unavailable.
* The deployed application requires the appropriate frontend and backend environment configuration.
* Advanced authentication features and production-scale infrastructure are outside the scope of the technical assignment.

---

## 🤖 AI Tool Usage

AI tools were used during development for:

* Debugging and resolving implementation issues
* Reviewing code structure
* Assisting with API and test development
* Generating and refining seed data
* Improving documentation

All generated code was reviewed, integrated, and tested as part of the application.

---

## ⏱️ Time Spent

Approximately **6 hours**, including:

* Backend/API implementation
* Frontend integration
* Database setup
* Ticket management functionality
* Testing
* Seed data
* Documentation

---

## 👨‍💻 Author

**Abeer Sharif**

B.E. Electronics and Computer Science Engineering

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐.
