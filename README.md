# Cogniva

An AI-powered learning platform that enables students to transform study materials into structured learning resources through intelligent summarization, quiz generation, and interactive assistance.

---

## Overview

Cogniva is a full-stack web application designed to enhance the learning experience by leveraging artificial intelligence. The platform allows users to upload study materials, generate concise summaries, create quizzes, interact with an AI assistant, and monitor their learning progress through an intuitive interface.

Built with a modern technology stack, Cogniva combines a React frontend with a FastAPI backend and MongoDB database to deliver a responsive and scalable learning environment.

---

## Key Features

* Secure user authentication using JWT
* AI-powered document summarization
* Automatic quiz generation from uploaded content
* Interactive AI study assistant
* Document upload and management
* Progress and performance tracking
* Responsive and modern user interface
* RESTful API architecture

---

## Technology Stack

### Frontend

* React.js
* React Router
* Axios
* HTML5
* CSS3

### Backend

* FastAPI
* Python
* Pydantic
* Motor (Async MongoDB Driver)
* JWT Authentication

### Database

* MongoDB

### AI Integration

* Google Gemini API

---

## Project Structure

```text
Cogniva/
│
├── backend/
│   ├── routers/
│   ├── models/
│   ├── utils/
│   ├── database.py
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── assets/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Aryan273-rio/Cogniva.git

cd Cogniva
```

---

### 2. Backend Setup

Create a virtual environment.

```bash
python -m venv venv
```

Activate the environment.

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

Install the required dependencies.

```bash
pip install -r requirements.txt
```

Create a `.env` file in the backend directory.

```env
MONGODB_URL=your_mongodb_connection_string

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60

GEMINI_API_KEY=your_gemini_api_key
```

Start the FastAPI server.

```bash
uvicorn main:app --reload
```

The backend will be available at:

```
http://localhost:8000
```

---

### 3. Frontend Setup

Navigate to the frontend directory.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

The frontend will be available at:

```
http://localhost:5173
```

---

## API

Authentication endpoints include:

| Method | Endpoint    | Description                         |
| ------ | ----------- | ----------------------------------- |
| POST   | `/register` | Register a new user                 |
| POST   | `/login`    | Authenticate an existing user       |
| GET    | `/profile`  | Retrieve authenticated user profile |

---

## Application Workflow

1. Register or log in to the platform.
2. Upload study material or notes.
3. Generate AI-powered summaries.
4. Create quizzes from uploaded content.
5. Interact with the AI assistant for concept clarification.
6. Track learning progress and quiz performance.

---

## Future Improvements

* Flashcard generation
* OCR support for scanned documents
* Voice-based interaction
* Personalized study recommendations
* Study planner and reminders
* Multi-language support
* Collaborative workspaces
* Dark mode
* Cloud file storage integration

---

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new feature branch.

```bash
git checkout -b feature/your-feature
```

3. Commit your changes.

```bash
git commit -m "Add your feature"
```

4. Push to your branch.

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

---

## Author

**Aryan S V**

* GitHub: https://github.com/Aryan273-rio

---

## Acknowledgements

* FastAPI
* React
* MongoDB
* Google Gemini API

---

If you find this project useful, consider giving the repository a ⭐ to support its development.
