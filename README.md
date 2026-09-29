# Contact Management System

A REST API for managing personal and professional contacts, built with **Node.js**, **Express.js**, **MongoDB** and **Mongoose**.

## Features
- Full CRUD for contacts
- Schema-level validation (required fields, 10-digit phone, email format)
- Unique `contactId` and `email`
- Centralized error handling with clear JSON error messages (400 / 404 / 409 / 500)

## Tech Stack
Node.js · Express.js · MongoDB · Mongoose · dotenv · nodemon

## Project Structure
```
contact-management/
├── config/
│   └── db.js                  # MongoDB connection (db: contact_management)
├── controllers/
│   └── contactController.js   # CRUD logic
├── middleware/
│   └── errorHandler.js        # 404 + validation/duplicate error handling
├── models/
│   └── Contact.js             # ContactSchema + Contact model
├── routes/
│   └── contactRoutes.js       # /contacts routes
├── .env.example
├── .gitignore
├── package.json
├── server.js                  # App entry point
└── README.md
```

## Contact Schema
| Field       | Type   | Rules                                      |
|-------------|--------|--------------------------------------------|
| `contactId` | String | Required, unique                           |
| `name`      | String | Required, min 2 characters                 |
| `phone`     | String | Required, exactly 10 digits                |
| `email`     | String | Unique, valid email format, stored lowercase |

`createdAt` and `updatedAt` timestamps are added automatically.

## Setup Instructions

**Prerequisites:** Node.js (v18+) and MongoDB (local install or a MongoDB Atlas cluster).

1. Clone the repository
   ```bash
   git clone https://github.com/<your-username>/contact-management.git
   cd contact-management
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root (see `.env.example`)
   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017
   ```
   For Atlas: `MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net`
   The app always uses the database **`contact_management`**.
4. Run the server
   ```bash
   npm run dev     # development (nodemon)
   npm start       # production
   ```
   Server runs at `http://localhost:3000`.

## API Endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint        | Description              |
|--------|-----------------|--------------------------|
| POST   | `/contacts`     | Add a new contact        |
| GET    | `/contacts`     | Fetch all contacts       |
| GET    | `/contacts/:id` | Fetch a contact by `contactId` |
| PUT    | `/contacts/:id` | Update contact details   |
| DELETE | `/contacts/:id` | Delete a contact         |

> `:id` refers to the contact's `contactId` (e.g. `C001`). `contactId` cannot be changed through PUT.

## Example Requests & Responses

### 1. Create a contact
`POST /contacts`
```json
{
  "contactId": "C001",
  "name": "Rajith",
  "phone": "9876543210",
  "email": "rajith@example.com"
}
```
**201 Created**
```json
{
  "success": true,
  "message": "Contact created",
  "data": {
    "_id": "6710f3a2c1b2a3d4e5f60718",
    "contactId": "C001",
    "name": "Rajith",
    "phone": "9876543210",
    "email": "rajith@example.com",
    "createdAt": "2026-10-01T10:00:00.000Z",
    "updatedAt": "2026-10-01T10:00:00.000Z"
  }
}
```

### 2. Get all contacts
`GET /contacts`

**200 OK**
```json
{
  "success": true,
  "count": 1,
  "data": [
    { "contactId": "C001", "name": "Rajith", "phone": "9876543210", "email": "rajith@example.com" }
  ]
}
```

### 3. Get a contact by ID
`GET /contacts/C001`

**200 OK**
```json
{
  "success": true,
  "data": { "contactId": "C001", "name": "Rajith", "phone": "9876543210", "email": "rajith@example.com" }
}
```

### 4. Update a contact
`PUT /contacts/C001`
```json
{ "phone": "9123456780" }
```
**200 OK**
```json
{
  "success": true,
  "message": "Contact updated",
  "data": { "contactId": "C001", "name": "Rajith", "phone": "9123456780", "email": "rajith@example.com" }
}
```

### 5. Delete a contact
`DELETE /contacts/C001`

**200 OK**
```json
{
  "success": true,
  "message": "Contact deleted",
  "data": { "contactId": "C001", "name": "Rajith", "phone": "9123456780", "email": "rajith@example.com" }
}
```

## Error Handling Examples

**Validation error — 400 Bad Request**
`POST /contacts` with `{ "contactId": "C002", "name": "A", "phone": "12345", "email": "wrong-email" }`
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "name", "message": "Name must be at least 2 characters" },
    { "field": "phone", "message": "Phone number must be exactly 10 digits" },
    { "field": "email", "message": "Please provide a valid email address" }
  ]
}
```

**Duplicate email or contactId — 409 Conflict**
```json
{
  "success": false,
  "message": "A contact with this email already exists",
  "errors": [{ "field": "email", "message": "email 'rajith@example.com' is already in use" }]
}
```

**Contact not found — 404 Not Found**
```json
{ "success": false, "message": "Contact 'C999' not found" }
```

**Malformed JSON — 400 Bad Request**
```json
{ "success": false, "message": "Invalid JSON in request body" }
```

## Testing
All endpoints were tested with Postman / Thunder Client. A ready-made Postman collection is included: `Contact-Management.postman_collection.json` (import it into Postman or Thunder Client).

## Author
Jainulavudeen F
