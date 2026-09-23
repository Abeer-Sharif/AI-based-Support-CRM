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
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
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
* Closed

---

## 👨‍💻 Author

**Abeer Sharif**

B.E. Electronics and Computer Science Engineering

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐.
