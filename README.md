# Simple Loan Management System API

This project is a simple backend for a loan management system built with Node.js, Express.js, and MongoDB.

## Features

- User authentication (registration and login)

- CRUD operations for loans

- Loan calculation

- Loan status update

- Basic security measures (input validation, token-based authentication)

## Prerequisites

- Node.js (v14 or later)

- MongoDB

## Setup

1. Clone the repository:

   ```

   git clone https://github.com/yourusername/loan-management-api.git

   cd loan-management-api

   ```

2. Install dependencies:

   ```

   npm install

   ```

3. Create a .env file in the root directory with the following content:

   ```

   MONGODB_URI=mongodb+srv://stevenochieng6305:NFXPlJ0ISZUGjXgh@cluster0.chs6o.mongodb.net/
   JWT_SECRET=eyJ1c2VyIjoiam9obiIsICJyb2xlIjoiYWRtaW4ifQ
   PORT=3000
   ```

4. Start the MongoDB server.

5. Run the application:

   - For development:

     ```

     npm run dev

     ```

   - For production:

     ```

     npm start

     ```

## API Documentation

### Overview

This document provides details about the API endpoints.

- You can also access the Swagger documentation at `http://localhost:3000/api-docs` after starting the server.

## Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Loan Management](#loan-management)
4. [Loan Calculations](#loan-calculations)

## Authentication

All API endpoints, except for user registration and login, require a valid JWT token in the Authorization header.

Example:

```
Authorization: Bearer <your_token>
```

## User Management

### Register a User

Create a new user account.

- **URL:** `/api/users/register`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "testuser",
    "password": "testpassword"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "user": {
        "username": "testuser",
        "password": "<hashed_password>",
        "_id": "<user_id>",
        "__v": 0
      },
      "token": "<jwt_token>"
    }
    ```

### Login

Authenticate a user and receive a JWT token.

- **URL:** `/api/users/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "testuser",
    "password": "testpassword"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "user": {
        "username": "testuser",
        "password": "<hashed_password>",
        "_id": "<user_id>",
        "__v": 0
      },
      "token": "<jwt_token>"
    }
    ```

## Loan Management

### Create a Loan

Create a new loan entry.

- **URL:** `/api/loans`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer <your_token>`
- **Request Body:**
  ```json
  {
    "borrowerName": "John Doe",
    "loanAmount": 10000,
    "interestRate": 5,
    "loanTerm": 12,
    "paymentDueDate": "2024-09-30"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "borrowerName": "John Doe",
      "loanAmount": 10000,
      "interestRate": 5,
      "loanTerm": 12,
      "loanStatus": "Pending",
      "paymentDueDate": "2024-09-30T00:00:00.000Z",
      "createdBy": "<user_id>",
      "_id": "<loan_id>",
      "createdAt": "2024-09-30T15:01:50.931Z",
      "updatedAt": "2024-09-30T15:01:50.931Z",
      "__v": 0
    }
    ```

### Get All Loans

Retrieve a list of all loans.

- **URL:** `/api/loans`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer <your_token>`
- **Success Response:**
  - **Code:** 200
  - **Content:** Array of loan objects

### Get Specific Loan

Retrieve details of a specific loan.

- **URL:** `/api/loans/:id`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer <your_token>`
- **Success Response:**
  - **Code:** 200
  - **Content:** Loan object

### Update Loan Status

Update the status of a specific loan.

- **URL:** `/api/loans/:id/status`
- **Method:** `PATCH`
- **Headers:**
  - `Authorization: Bearer <your_token>`
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "status": "Approved"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:** Updated loan object

### Delete a Loan

Delete a specific loan.

- **URL:** `/api/loans/:id`
- **Method:** `DELETE`
- **Headers:**
  - `Authorization: Bearer <your_token>`
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "message": "Loan has been deleted successfully",
      "loan": {
        // Deleted loan object
      }
    }
    ```

## Loan Calculations

### Calculate Total Repayment Amount

Calculate the total repayment amount for a loan based on its terms.

- **URL:** `/api/loans/calculate`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer <your_token>`
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "loanAmount": 10000,
    "interestRate": 5,
    "loanTerm": 12
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:**
    ```json
    {
      "monthlyPayment": "856.07",
      "totalRepayment": "10272.84"
    }
    ```

## Testing

This project uses Jest for testing. The tests cover loan calculations and CRUD operations for loans.

### Prerequisites

- Ensure you have Node.js installed (v14 or later).
- MongoDB should be running if your tests require database access.

### Running Tests

To run the tests, use the following command:

```
npm test
```

### Running Tests with Open Handles Detection

If you encounter issues with tests not exiting properly, you can run Jest with the `--detectOpenHandles` flag to help identify any open handles that might be causing the tests to hang:

```
npm test -- --detectOpenHandles
```

### Test Coverage

The tests include:

- **Loan Calculation Tests**:

  - Validates the calculation of monthly payments and total repayment amounts.
  - Checks for proper error handling with invalid input.

- **Loan CRUD Operations Tests**:
  - Tests for creating a new loan.
  - Tests for retrieving all loans and specific loans by ID.
  - Tests for updating loan details.
  - Tests for deleting a loan.

### Note

Make sure to replace `<your_token>` in the test files with a valid JWT token for authentication if your tests require it.
