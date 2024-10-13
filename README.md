# BrainWave Server

## Environment Variables

Before starting the server, ensure the following environment variables are configured:

```
ASSISTANT_ID=           # ID for the AI assistant used in question-answering
BACKEND_URL=            # URL where the backend server is hosted
DB_URI=                 # MongoDB connection string
EMAIL_PASS=             # Password for the system's email account
EMAIL_USER=             # Email address for sending system emails
FRONTEND_URL=           # URL of the frontend application
NODE_ENV=               # Environment (development or production)
OPENAI_API_KEY=         # API key for OpenAI GPT model
PORT=                   # Port on which the server runs (default: 3000)
SECRET_KEY=             # Secret key for JWT signing and encryption
```

Make sure these variables are set in your `.env` file or through your deployment environment.

---

## Features

- **AI-powered question-answering**: Provides accurate responses based on user-submitted questions.
- **JWT-based Authentication**: Secure login and authentication mechanism.
- **User-friendly API**: Easy to integrate with various front-end applications.
- **Fine-tuned GPT model**: Optimized for high-quality response generation.
- **Session-based Interaction**: Maintains thread sessions for each user query.

---

## Technologies Used

- **Node.js**: Backend framework.
- **Express.js**: API route handling.
- **JWT**: Secure token-based authentication.
- **MongoDB**: Database for storing user data and sessions.
- **AI Model (GPT)**: Powering the intelligent responses to user questions.

---

## Getting Started

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/BrainWave-Server.git
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the server:
    ```bash
    npm start
    ```

---

## API Endpoints

### Login

#### **POST** `/login`
Handles user authentication by verifying email and password.

- **Request Body**:
  - `email` (String): User's email.
  - `password` (String): User's password.

- **Response**:
  - **200 OK**: Returns a JWT token on successful login.
  - **400 Bad Request**: If credentials are invalid.

#### **GET** `/login/auth`
Verifies if the user's JWT token is valid.

- **Headers**:
  - `Authorization`: Bearer token from login.

- **Response**:
  - **200 OK**: Returns user details if the token is valid.
  - **403 Forbidden**: If the token is invalid.

---

### Logout

#### **POST** `/logout`
Logs out the user by invalidating their session.

- **Response**:
  - **200 OK**: Logout successful.
  - **400 Bad Request**: If no session was active.

---

### Signup

#### **POST** `/signup`
Allows a new user to create an account.

- **Request Body**:
  - `email` (String): New user's email.
  - `password` (String): New user's password.
  - `name` (String): Full name of the user.

- **Response**:
  - **201 Created**: Returns user details and token after successful signup.
  - **400 Bad Request**: If the email is already in use.

---

### Reset Password

#### **POST** `/reset`
Sends a password reset link to the user’s email.

- **Request Body**:
  - `email` (String): The email associated with the account.

- **Response**:
  - **200 OK**: If the reset email is sent.
  - **404 Not Found**: If the email does not exist in the system.

---

### Resend Verification

#### **POST** `/resend-verification`
Resends the account verification email.

- **Request Body**:
  - `email` (String): The email that needs verification.

- **Response**:
  - **200 OK**: If the email is successfully sent.
  - **404 Not Found**: If the email is not found.

---

### Verify Account

#### **GET** `/verify`
Verifies the user’s email based on the verification token.

- **Query Params**:
  - `token` (String): Verification token sent via email.

- **Response**:
  - **200 OK**: If the account is verified.
  - **400 Bad Request**: If the token is invalid.

---

### Update User

#### **PUT** `/update`
Allows the user to update their account details.

- **Request Body**:
  - `email` (String, optional): New email.
  - `password` (String, optional): New password.
  - `name` (String, optional): Updated name.

- **Response**:
  - **200 OK**: If the update is successful.
  - **400 Bad Request**: If the input data is invalid.

---

### Ask a Question

#### **POST** `/questions`
Sends a question to the AI model to get an answer.

- **Request Body**:
  - `question` (String): The user’s query.
  - `threadId` (String, optional): The thread for continuing a session.

- **Response**:
  - **200 OK**: Returns the answer from the AI.
  - **400 Bad Request**: If the question is missing.

---

### Resume Upload

#### **POST** `/resume`
Uploads and processes a resume.

- **Request Body**:
  - `file` (File): The resume file to upload.

- **Response**:
  - **200 OK**: If the file is uploaded and processed.
  - **400 Bad Request**: If the file is invalid or missing.

---

### Delete Account

#### **DELETE** `/delete`
Deletes the user’s account permanently.

- **Response**:
  - **200 OK**: If the account is successfully deleted.
  - **404 Not Found**: If the user does not exist.

---

## Special Features

### AskQuestionToAI Design

The `AskQuestionToAI` route has a special design feature. When a question is submitted without a `threadId`, the API first sends the question to the tuned GPT model so it understands the context of the query. This helps the AI know which problem is being solved and then proceeds with the user's input to provide an accurate response. This design is intentional to facilitate complex, multi-step problem-solving.

