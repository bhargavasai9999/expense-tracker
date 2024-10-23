Here’s the updated `README.md` to reflect the changes you made to the transaction routes, including dynamic category creation, transaction operations, and summary calculations:

```markdown
# Personal Expense Tracker API

## Introduction

The **Personal Expense Tracker** is a RESTful API that allows users to manage their financial records by tracking their income and expenses. Users can record transactions, retrieve past transactions, and get summaries by category or time period. This application is built using Node.js, Express.js, and MongoDB.

## Technologies Used

- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)

## Setup and Installation

### Prerequisites

- Node.js (v20 or later)
- MongoDB (local installation or MongoDB Atlas)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/bhargavasai9999/expense-tracker.git
   cd expense-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory of the project and add the following environment variables:

   ```
   PORT=5000
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the server**

   ```bash
   npm start
   ```

   The server should start on `http://localhost:5000`.

## API Documentation

### Authentication

**POST /api/users/register**
- **Request Body**: 
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered",
  }
  ```

**POST /api/users/login**
- **Request Body**: 
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```
- **Response**:
  ```json
  {
    "token": "your_jwt_token"
  }
  ```

### Transaction Routes

#### Add a Transaction
**POST /api/transactions**
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Request Body**: 
  ```json
  {
    "type": "income",
    "categoryName": "Salary",
    "amount": 5000,
    "date": "2024-10-01T00:00:00.000Z",
    "description": "October salary"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "Transaction added successfully",
    "data": {
      "_id": "transaction_id",
      "type": "income",
      "category": {
        "id": "category_id",
        "name": "Salary",
        "type": "income"
      },
      "amount": 5000,
      "date": "2024-10-01T00:00:00.000Z",
      "description": "October salary",
      "user": "user_id",
      "createdAt": "2024-10-01T12:00:00.000Z",
      "updatedAt": "2024-10-01T12:00:00.000Z"
    }
  }
  ```

#### Get All Transactions
**GET /api/transactions**
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page` (optional, default: 1)
  - `limit` (optional, default: 10)
- **Response**: 
  ```json
  [
    {
      "_id": "transaction_id",
      "type": "income",
      "category": {
        "id": "category_id",
        "name": "Salary",
        "type": "income"
      },
      "amount": 5000,
      "date": "2024-10-01T00:00:00.000Z",
      "description": "October salary"
    },
    {
      "_id": "transaction_id",
      "type": "expense",
      "category": {
        "id": "category_id",
        "name": "Groceries",
        "type": "expense"
      },
      "amount": 1000,
      "date": "2024-10-02T00:00:00.000Z",
      "description": "Grocery shopping"
    }
  ]
  ```

#### Get Transaction by ID
**GET /api/transactions/:id**
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Response**: 
  ```json
  {
    "_id": "transaction_id",
    "type": "income",
    "category": {
      "id": "category_id",
      "name": "Salary",
      "type": "income"
    },
    "amount": 5000,
    "date": "2024-10-01T00:00:00.000Z",
    "description": "October salary"
  }
  ```

#### Update Transaction
**PUT /api/transactions/:id**
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Request Body**: 
  ```json
  {
    "type": "expense",
    "categoryName": "Rent",
    "amount": 1500,
    "date": "2024-10-03T00:00:00.000Z",
    "description": "October rent"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "Transaction updated successfully",
    "data": {
      "_id": "transaction_id",
      "type": "expense",
      "category": {
        "id": "category_id",
        "name": "Rent",
        "type": "expense"
      },
      "amount": 1500,
      "date": "2024-10-03T00:00:00.000Z",
      "description": "October rent"
    }
  }
  ```

#### Delete Transaction
**DELETE /api/transactions/:id**
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Response**: 
  ```json
  {
    "message": "Transaction deleted"
  }
  ```

### Summary Route

#### Get Summary of Transactions
**GET /api/summary**
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Query Parameters** (optional):
  - `startDate`: The start date for the summary (e.g., `2024-01-01`).
  - `endDate`: The end date for the summary (e.g., `2024-12-31`).
- **Response**:
  ```json
  {
    "totalIncome": 10000,
    "totalExpenses": 4000,
    "balance": 6000
  }
  ```

## API TESTING

You can test the API using Postman or other tools. Below are the steps to follow:

1. Use the **Register** endpoint to create a new user.
2. Use the **Login** endpoint to get a JWT token.
3. Add the token to the Authorization header of subsequent requests using the format `Bearer <token>`.
4. Test all the available endpoints as described in the above.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
```

### Key Clarifications:
- **Dynamic Category Creation**: The API will create a new category if it doesn’t exist when adding or updating a transaction.
- **Get Summary Endpoint**: Added a route to get an income-expense summary for a given date range.
