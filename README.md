# AI-Powered Support CRM
<img width="1827" height="880" alt="image" src="https://github.com/user-attachments/assets/899837f8-b395-4060-9df8-d38c367649d0" />

A full-stack customer support CRM built using the MERN stack with AI-powered ticket triage using a locally hosted Llama 3.2 3B model through Ollama.

## Features

### Core CRM Features

- Create support tickets
- Automatically generate unique ticket IDs
- View all support tickets
- Search tickets
- Filter tickets by status
- View detailed ticket information
- Update ticket status
- Add notes and comments
- Store ticket data in MongoDB

### AI Ticket Triage

When a new ticket is created, the backend sends the ticket subject and description to a locally hosted Llama 3.2 3B model through Ollama.

The model automatically classifies the ticket into:

- Category
- Priority
- Sentiment

The AI response is validated before being stored in MongoDB.

The AI service includes:

- Structured JSON output
- Response validation
- Request timeout handling
- Graceful fallback when Ollama is unavailable
- Isolated AI service architecture

If the AI service fails, ticket creation continues using safe fallback values:

Category: Other
Priority: Medium
Sentiment: Neutral

This ensures that an AI failure does not interrupt the core ticket creation workflow.

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- REST API

### Database

- MongoDB
- Mongoose

### AI

- Ollama
- Llama 3.2 3B

## Project Structure

## Project Structure

<pre>
support-crm/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   │   └── aiTriage.js
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── .env.example
├── .gitignore
└── README.md
</pre>
## Prerequisites

Before running the project, install:

- Node.js
- npm
- MongoDB
- Ollama
- Git

## Installation

### 1. Clone the Repository

git clone YOUR_GITHUB_REPOSITORY_URL
cd support-crm

### 2. Install Backend Dependencies

cd backend
npm install

### 3. Install Frontend Dependencies

Open a new terminal:

cd frontend
npm install

## Environment Variables

Create a .env file inside the backend directory.

Example:

PORT=5001
DB_URL=your_mongodb_connection_string

A template is provided in .env.example.

Never commit your actual .env file or database credentials to GitHub.

## Running the Application

The application requires:

1. MongoDB
2. Ollama
3. Backend server
4. Frontend development server

### 1. Start MongoDB

Make sure your MongoDB instance is running.

### 2. Start Ollama

Pull the required model:

ollama pull llama3.2:3b

Run the model:

ollama run llama3.2:3b

Ollama provides the local API used by the backend.

The AI service communicates with:

http://localhost:11434/api/generate

Keep Ollama running while testing AI ticket triage.

### 3. Start the Backend

From the backend directory:

npm start

The backend runs on:

http://localhost:5001

### 4. Start the Frontend

From the frontend directory:

npm run dev

The frontend runs on:

http://localhost:5173

## AI Ticket Triage Flow

User creates ticket
        |
        v
React Frontend
        |
        v
POST /tickets
        |
        v
Express Controller
        |
        v
aiTriage.js
        |
        v
Ollama API
        |
        v
Llama 3.2 3B
        |
        v
Category + Priority + Sentiment
        |
        v
Validation
        |
        v
MongoDB
        |
        v
Ticket displayed in frontend

The frontend never communicates directly with the AI model.

The backend handles communication with Ollama:

React -> Express -> AI Service -> Ollama

This keeps the AI logic isolated from the frontend and makes it easier to test or replace the model later.

## AI Failure Handling

AI is treated as an enhancement rather than a dependency for basic ticket creation.

If Ollama is unavailable, times out, or returns invalid output, the backend uses:

Category: Other
Priority: Medium
Sentiment: Neutral

The ticket is still created successfully.

This ensures that AI failures do not interrupt the core CRM workflow.

## Ticket Management

Tickets support the following statuses:

- Open
- In Progress
- Closed

Users can:

- Create tickets
- View tickets
- Search tickets
- Filter tickets by status
- View ticket details
- Update ticket status
- Add notes and comments

## REST API

The backend provides REST APIs for ticket management.

### Create Ticket

POST /tickets

Creates a new ticket and performs AI triage.

### Get Tickets

GET /tickets

Returns available tickets.

### Get Ticket

GET /tickets/:id

Returns details for a specific ticket.

### Update Ticket

PUT /tickets/:id

Updates ticket information such as status and notes.

## AI Classification Example

Example Ticket:

Subject:
I was charged twice for my subscription.

Description:
I purchased the subscription yesterday and my account shows two separate charges.

Example AI Result:

Category: Billing
Priority: High
Sentiment: Negative

Example Test Cases:

1. Duplicate charge
   Category: Billing
   Priority: High
   Sentiment: Negative

2. Password change
   Category: Account
   Priority: Low
   Sentiment: Neutral

3. Missing package
   Category: Shipping
   Priority: High
   Sentiment: Negative

## Testing

The application was tested for:

- Ticket creation
- Ticket persistence
- Ticket listing
- Ticket search
- Status filtering
- Ticket updates
- Notes and comments
- AI ticket classification
- Ollama availability
- AI timeout handling
- Invalid AI output handling
- AI fallback handling
- Frontend production build

## Design Decisions

### Local LLM

Ollama with Llama 3.2 3B was selected to run the AI model locally without requiring an external AI API.

### Isolated AI Service

AI logic is implemented in a dedicated aiTriage.js service instead of placing model communication directly inside the ticket controller.

This keeps the controller focused on ticket management and makes the AI component easier to test and replace.

### Structured Output Validation

The AI response is expected to contain:

- category
- priority
- sentiment

The backend validates these values against the allowed values before storing them in MongoDB.

### Graceful Fallback

AI classification should never prevent a support ticket from being created.

If AI processing fails, safe fallback values are used and the ticket creation process continues normally.

## Future Improvements

Possible future improvements include:

- Role-based access for customers, agents, and administrators
- Agent assignment
- Email notifications
- Analytics dashboard
- Multi-channel ticket ingestion
- Attachment support
- Cloud-hosted LLM support for production deployment
- Automated response suggestions

## Author

Abeer Sharif

Built as part of an AI + Technology Internship Assessment.
