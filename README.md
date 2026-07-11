# GearUp API

GearUp is a backend service for a gear rental marketplace built with Node.js, Express, TypeScript, Prisma, and PostgreSQL. It supports user registration and authentication, gear browsing, rental ordering, provider inventory management, admin oversight, payment initiation, and review submission.

## Overview

This project exposes a RESTful API for a rental platform where:

- Customers can browse available gear, place rental orders, and view their order history.
- Providers can add, update, and manage rental gear inventory and handle incoming orders.
- Admins can manage users, inspect gear inventory, and review orders.
- Payments are integrated with Stripe through payment intents and payment confirmation flows.
- Customers can submit reviews for gear they rented and returned.

## Features

- JWT-based authentication with cookie storage
- Role-based access control for customer, provider, and admin users
- Public endpoints for gear discovery and category lookup
- Provider-specific inventory and order management
- Customer rental order placement and retrieval
- Admin dashboard-style user and inventory management endpoints
- Stripe payment intent creation and confirmation
- Review submission for completed rentals

## Tech Stack

- Runtime: Node.js
- Framework: Express.js
- Language: TypeScript
- ORM/DB: Prisma + PostgreSQL
- Authentication: JSON Web Tokens (JWT)
- Payment integration: Stripe
- Dev tooling: tsx, TypeScript, Prisma CLI

## Project Structure

```text
src/
  admin/          # Admin routes/controllers
  auth/           # Auth routes, middleware, services, interfaces
  payment/        # Stripe payment flow
  provider/       # Gear provider operations
  public/         # Public gear/category endpoints
  review/         # Review submission logic
  user/           # Customer rental/order routes
  utils/          # Shared response, token, and error helpers
  app.ts          # Main Express app setup
  server.ts       # Server bootstrap
prisma/
  schema.prisma   # Prisma schema entrypoint
  *.prisma        # Domain-specific Prisma models
```

## Prerequisites

Make sure the following are installed:

- Node.js 18+
- npm
- PostgreSQL database (or a Prisma-compatible Postgres provider)

## Environment Variables

Create a .env file in the project root with values similar to:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
SALT_ROUND=10
PORT=4000
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_TIME="1d"
JWT_REFRESH_TIME="7d"
NODE_ENV="development"
STRIPE_SECRET_KEY="your-stripe-secret-key"
```

### Notes

- The workspace already contains a .env file with local development values.
- The Stripe key is required for payment routes to work.

## Installation

```bash
npm install
```

## Database Setup

Generate Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

If you only need to apply existing migrations in a non-development environment:

```bash
npx prisma migrate deploy
```

## Running the Server

Start the development server:

```bash
npm run dev
```

The server will run on:

```text
http://localhost:4000
```

## Authentication Flow

Authentication is handled through JWTs stored in cookies:

- `accessToken` for short-lived API access
- `refreshToken` for refreshing expired access tokens

### Auth Endpoints

| Method | Path               | Description                               |
| ------ | ------------------ | ----------------------------------------- |
| POST   | /api/auth/register | Register a new user                       |
| POST   | /api/auth/login    | Login a user                              |
| GET    | /api/auth/me       | Retrieve the authenticated user's profile |

### Registration Example

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123",
  "role": "customer"
}
```

### Login Example

```json
{
  "email": "alice@example.com",
  "password": "secret123"
}
```

## API Endpoints

All responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Public Routes

| Method | Path            | Description                |
| ------ | --------------- | -------------------------- |
| GET    | /api/gear       | Get all gears in inventory |
| GET    | /api/gear/:id   | Get a single gear item     |
| GET    | /api/categories | Get all gear categories    |

### Customer Routes

These routes require the authenticated user to have the `customer` role.

| Method | Path             | Description                          |
| ------ | ---------------- | ------------------------------------ |
| GET    | /api/rentals     | Get the current user's rental orders |
| GET    | /api/rentals/:id | Get one rental order by ID           |
| POST   | /api/rentals     | Place a new rental order             |

### Provider Routes

These routes require the authenticated user to have the `provider` role.

| Method | Path                     | Description                        |
| ------ | ------------------------ | ---------------------------------- |
| POST   | /api/provider/gear       | Add new gear to inventory          |
| PUT    | /api/provider/gear/:id   | Update existing gear               |
| DELETE | /api/provider/gear/:id   | Delete gear owned by the provider  |
| GET    | /api/provider/orders     | Get orders for the provider's gear |
| PATCH  | /api/provider/orders/:id | Update an order status             |

### Admin Routes

These routes require the authenticated user to have the `admin` role.

| Method | Path                 | Description                    |
| ------ | -------------------- | ------------------------------ |
| GET    | /api/admin/users     | Get all users                  |
| PATCH  | /api/admin/users/:id | Toggle a user's account status |
| GET    | /api/admin/gear      | Get all gear inventory         |
| GET    | /api/admin/rentals   | Get all rental orders          |

### Payment Routes

These routes require an authenticated user.

| Method | Path                  | Description                                       |
| ------ | --------------------- | ------------------------------------------------- |
| POST   | /api/payments/create  | Create a Stripe payment intent for an order       |
| POST   | /api/payments/confirm | Confirm a payment and mark the order as confirmed |
| GET    | /api/payments         | Get payment history for the authenticated user    |
| GET    | /api/payments/:id     | Get payment details by ID                         |

### Review Routes

| Method | Path                 | Description                       |
| ------ | -------------------- | --------------------------------- |
| POST   | /api/reviews/reviews | Submit a review for returned gear |

## Example Payloads

### Create Gear (Provider)

```json
{
  "name": "Hiking Backpack",
  "description": "Waterproof travel backpack",
  "price": 25,
  "brand": "Northstar",
  "tag": "outdoors"
}
```

### Place Order (Customer)

```json
{
  "gearId": "<gear-id>",
  "quantity": 2,
  "location": "Dhaka"
}
```

### Create Payment Intent

```json
{
  "rentalOrderId": "<order-id>"
}
```

## Data Model Summary

The application uses the following main Prisma models:

- User: stores user profile, role, and account status
- GearInventory: stores gear details, price, brand, and owner reference
- Categories: stores gear tags/categories
- GearCategories: joins gear with categories
- RentalOrder: stores rental order details and statuses
- Payments: stores Stripe-related payment records
- Reviews: stores user reviews for gear

### Core Enums

- UserRole: `customer`, `provider`, `admin`
- AccountStatus: `ACTIVE`, `BLOCKED`
- OrderStatus: `PENDING`, `CONFIRMED`, `PICKED_UP`, `RETURNED`, `CANCELLED`
- PaymentStatus: `PENDING`, `COMPLETED`, `FAILED`

## Notes for Development

- The API uses cookie-based auth, so requests should be made with cookies enabled in your client.
- The payment flow is designed to be Postman-friendly and uses database updates for confirmation rather than a full webhook-based Stripe callback flow.
- The current root route in the app is a placeholder and should be replaced with a real health-check endpoint before production deployment.

## Useful Commands

```bash
npm run dev
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

## Postman Collection

A ready-to-import Postman collection is available at [postman/gearup-api.postman_collection.json]([postman/gearup-api.postman_collection.json](https://rifatging-2264859.postman.co/workspace/Rifat-Ging's-Workspace~b5bab31e-27e6-4db3-8592-27a24ae3a46e/folder/49011259-67c782cb-aa27-46fe-b7cb-bdff0d42b0d0?sideView=agentMode)).

Import it into Postman, then set the `baseUrl` variable to your local or deployed server URL. The current Render deployment base URL is `https://gearup-x54j.onrender.com/`.

## Demo Credentials

The database already includes these users for quick testing:

- Customer
  - email: `rifat@example.com`
  - password: `rifat123`

- Provider
  - email: `islam@example.com`
  - password: `islam123`

- Admin
  - email: `reyan@example.com`
  - password: `reyan123`

Live Linl: https://gearup-x54j.onrender.com

## License

This project is currently unlicensed and intended for educational or internal use.
