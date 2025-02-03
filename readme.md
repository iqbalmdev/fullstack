# Fullstack Assignment - Microservices Architecture


## Table of Contents
- [Project Overview](#project-overview)
- [Project Overview](#Project-Demo)
- [Final Note](#final-note)
- [Overall Project Structure](#overall-project-structure)
- [Implementing TCP Communication Between Microservices](#Implementing-TCP-Communication-Between-Microservices)
- [Final Note](#Final-Note)
- [Running the Entire Application with Docker](#Running-the-Entire-Application-with-Docker)
- [Frontend - Fullstack Assignment](#Overview)
- [Frontend - Fullstack Assignment](#Overview-auth-service)
- [Frontend - Fullstack Assignment](#Overview-user-service)


## Project Overview

This project was initially designed to include only the **User Service** microservice. However, to demonstrate microservice architecture, I have also implemented an **Auth Service** for authentication and token validation. The project follows a **microservices-based approach**, where different services handle different functionalities independently. Moreover, the task was initially given with only one microservice, which was the User Service. To demonstrate microservice architecture, I have added the Auth Service so that they individually work as independent microservices.

## Project Demo


#### Overview
In this demo, i showcase a full-stack application that consists of a frontend hosted on Vercel and a backend hosted on Render. This setup allows for seamless integration between the client and server, providing a smooth user experience.

#### Frontend: Vercel
- **Hosting Platform**: The frontend of the application is hosted on Vercel, a platform optimized for frontend frameworks and static sites. Vercel provides features such as automatic deployments, serverless functions, and global CDN, ensuring fast load times and scalability.
  
- **Framework**: The frontend is built using React, which allows for a dynamic and responsive user interface. The application leverages React's component-based architecture to create reusable UI components.

- **Environment Variables**: To manage sensitive information and configuration settings, environment variables are used. For instance, the API base URL is stored in an environment variable prefixed with `NEXT_PUBLIC_AUTH_URL`, ensuring that it is accessible during the build process.

- **Deployment**: The deployment process is streamlined with Vercel. Every push to the main branch triggers an automatic deployment, making it easy to keep the live application up-to-date with the latest changes.

- **Demo URL**: You can access the live demo of the application at [https://fullstack-sandy-zeta.vercel.app/](https://fullstack-sandy-zeta.vercel.app/).

#### Backend: Render
- **Hosting Platform**: The backend of the application is hosted on Render, a cloud platform that provides a simple way to deploy web applications and APIs. Render offers features such as automatic scaling, managed databases, and easy integration with GitHub for continuous deployment.

- **Framework**: The backend is built using NestJS, a progressive Node.js framework for building efficient and scalable server-side applications. NestJS utilizes TypeScript, providing strong typing and modern JavaScript features.

- **Database**: The backend connects to a MongoDB database, which is used to store user data and application state. The connection string for the database is managed through environment variables, ensuring that sensitive information is not hardcoded in the source code.

- **API Endpoints**: The backend exposes RESTful API endpoints that the frontend can consume. These endpoints handle various operations such as user authentication, data retrieval, and data manipulation.

#### Integration
- **Communication**: The frontend communicates with the backend through HTTP requests. Axios is used as the HTTP client to make API calls, and it is configured to include authentication tokens in the headers for secure access.

- **CORS Configuration**: CORS (Cross-Origin Resource Sharing) is configured on the backend to allow requests from the frontend's domain, ensuring that the two applications can interact without security issues.

#### Credentials for Demo
To test the application, you can use the following credentials:
- **Email**: `iqbal@gmail.com`
- **Password**: `test.io`

#### Conclusion
This demo highlights the capabilities of modern web development by showcasing a full-stack application that utilizes Vercel for the frontend and Render for the backend. The combination of these technologies allows for a robust, scalable, and efficient application that can handle user interactions seamlessly. 

By hosting the frontend and backend on platforms designed for their respective technologies, we ensure optimal performance and ease of maintenance, making it easier to focus on developing features and improving user experience.

## Implementing TCP Communication Between Microservices

To enable communication between **User Service** and **Auth Service**, I have implemented **TCP-based inter-service communication**. Here are the steps to achieve this:

### 1️⃣ Setup Microservices Client in `UserModule`
Modify `UserModule` to register the Auth Service as a microservice client:

```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 4000 },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

### 2️⃣ Modify `UserController` to Validate Tokens via Auth Service
```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Headers,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserService } from './user.service';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  private async validateToken(authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('Authorization token is required');
    }
    const token = authorization.split(' ')[1];
    try {
      const response = await firstValueFrom(
        this.authClient.send({ cmd: 'validate_token' }, { token }),
      );
      if (!response || !response.isValid) {
        throw new UnauthorizedException('Invalid or expired token');
      }
      return response.user;
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
```

### 3️⃣ Modify `AuthController` to Handle Token Validation Requests
```typescript
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'validate_token' })
  async validateToken(@Payload() data: { token: string }) {
    const isValid = await this.authService.validateToken(data.token);
    return { isValid: !!isValid, user: isValid };
  }
}
```

### 4️⃣ Start Auth Service as a TCP Server
Modify `auth-service/main.ts`:
```typescript
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.TCP,
    options: { host: 'localhost', port: 4000 },
  });

  await app.listen();
}
bootstrap();
```

## Final Note

I have successfully implemented the microservices architecture with inter-service communication using TCP. However, due to time constraints, I was unable to further optimize and extend the implementation. There are several additional improvements that can be made, such as implementing advanced authentication mechanisms, error handling, and adding logging for better observability.

This project still provides a strong foundation for microservices communication and authentication handling in a distributed system. This is the way to make a connection between microservices, but I faced some errors during integration, so I just made them microservices running independently.



---

## Overall Project Structure

```
fullstack/
├── frontend/               # Next.js frontend application
├── auth-service/           # NestJS authentication microservice
├── user-service/           # NestJS user management microservice
└── docker-compose.yml      # Docker setup to run all services
```

---

# Running the Entire Application with Docker



To run all services together, we use **Docker Compose**. This will set up the **frontend, auth service, and user service** within a single environment.

## Prerequisites

Ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Steps to Run the Project

1. **Clone the Repository**
   ```bash
   git clone https://github.com/iqbalmdev/fullstack.git
   cd fullstack
   ```

2. **Create a `.env` file** for environment variables in the front end folder:
   ```bash
   touch .env
   ```
   
   Add the following to the `.env` file:
   ```
   NEXT_PUBLIC_AUTH_URL=http://localhost:5001
   NEXT_PUBLIC_USER_URL=http://localhost:4001
   ```

3. **Run the project using Docker Compose**
   ```bash
   docker-compose up --build
   ```
   This will:
   - Start the **Frontend (Next.js)**
   - Start the **User Service (NestJS)**
   - Start the **Auth Service (NestJS)**

4. **Access the services** in your browser:
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **User Service:** [http://localhost:4001](http://localhost:4001)
   - **Auth Service:** [http://localhost:5002](http://localhost:5001)

### Stopping the Containers

To stop all running containers, use:
```bash
docker-compose down
```
This will gracefully shut down all services and free up ports.

-------


# Frontend - Fullstack Assignment

## Overview

This is the frontend for the Fullstack Assignment project. It is built using **Next.js**, with **Redux Toolkit** for state management, **Axios** for API interactions, and **Tailwind CSS + DaisyUI** for UI styling. The frontend interacts with multiple microservices, including **Auth Service** and **User Service**, through an Axios interceptor.

---

## Folder Structure

```
frontend/
├── components/            # Reusable UI components (e.g., Navbar, AuthWrapper)
├── containers/            # Page-specific components and containers
│   ├── user/              # User-related components
│   ├── auth/              # Authentication components (Login, Signup, etc.)
├── hooks/                 # Custom hooks
│   ├── reduxHooks.ts      # Hooks for Redux store
│   ├── useAuth.ts         # Custom hook for authentication
├── pages/                 # Next.js pages
│   ├── index.tsx          # Home page
│   ├── profile.tsx        # User profile page
├── providers/             # Providers for Redux store, Persisted state, etc.
├── redux/                 # Redux store setup
│   ├── slices/            # Redux slices (reducers)
│   │   ├── userSlice.ts   # User slice
│   │   ├── authSlice.ts   # Authentication slice
│   ├── actions/           # Async and sync Redux actions
│   │   ├── authActions.ts # Actions related to authentication
│   │   ├── userActions.ts # Actions related to users
├── styles/                # Global styles (e.g., globals.css)
├── utils/                 # Utility functions
│   ├── api/               # API services for microservices
│   │   ├── userApi.ts     # API functions for User Service
│   │   ├── authApi.ts     # API functions for Auth Service
│   ├── interceptors/      # Axios interceptors for handling requests
│   │   ├── axiosInstance.ts # Handles session management, token refresh, etc.
├── public/                # Static assets
├── .env                   # Environment variables
├── package.json           # Project dependencies
├── tailwind.config.js      # Tailwind CSS configuration
└── Dockerfile             # Docker setup for frontend
```

---

## Features Implemented

- **State Management:** Uses **Redux Toolkit** for global state management.
- **API Interaction:** Uses **Axios** for making API calls, with an **interceptor** to handle authentication and session expiration.
- **Hooks:** Custom React hooks for Redux and authentication logic.
- **Authentication:** Uses JWT-based authentication with login/logout functionality.
- **Theming:** Dark and light mode support using **DaisyUI** and **Tailwind CSS**.
- **Persistence:** Stores user session in **Redux Persist** to maintain state across reloads.
- **Environment Variables:** Uses `.env` file for storing API URLs and credentials.

---

## Environment Variables

Create a `.env.local` file in the root directory and add:

```
NEXT_PUBLIC_AUTH_URL=<auth-service-url>
NEXT_PUBLIC_USER_URL=<user-service-url>
--
## For testing the website 
email = iqbal@gmail.com
password = test.io
```

---

## Setup & Installation

### Prerequisites

- Node.js & npm


### Steps to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/iqbalmdev/fullstack.git
   cd fullstack/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Run with Docker (optional)

1. Build the Docker image:
   ```bash
   docker build -t frontend .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:3000 frontend
   ```

---

## UI & Styling

- Uses **Tailwind CSS** and **DaisyUI** for styling.
- Supports **dark mode** and **light mode**.
- Responsive design for mobile and desktop.

---

## API Interaction

### Axios Interceptors

The **Axios interceptors** play a crucial role in handling authentication and session management:

- **Global API Error Handling**: Automatically catches API errors and displays appropriate messages.
- **Token Injection**: Automatically includes the authentication token in each request header.
- **Session Expiration Handling**:
  - If a token is expired or invalid, it triggers a logout.
  - Redirects the user to the login page.
  - Refreshes the token if necessary.
- **Logout Handling**: If the server returns an unauthorized response (401), the user session is cleared from Redux Persist, and the user is redirected to the login page.

---

## Redux Setup

- **Slices:** Manage Redux state (e.g., `userSlice`, `authSlice`).
- **Actions:** Handle both sync and async Redux actions (`authActions.ts`, `userActions.ts`).
- **Hooks:** `useAppDispatch`, `useAppSelector` for accessing Redux state in components.
- **Easy State Management:** Redux Toolkit simplifies state handling, making it easier to manage user authentication and session data.

---

## Next Steps

- Implement additional API services.
- Add more microservices and improve API integration.
- Enhance UI/UX with animations and better design.

---



---


I'll structure the **Auth Service** README so that you can append it below the **Frontend README** seamlessly. Here’s the content:  

---

# Backend - Auth Service (Fullstack Assignment)

## Overview-auth-service

The **Auth Service** is a microservice responsible for authentication and authorization in the Fullstack Assignment project. It is built using **NestJS** with **MongoDB** for storage and **JWT** for authentication. It exposes both **HTTP** and **TCP** endpoints for token validation and user authentication.

---

## Folder Structure

```
auth-service/
├── src/                     # Source code
│   ├── auth/                # Authentication module
│   │   ├── auth.controller.ts  # Handles authentication routes
│   │   ├── auth.service.ts     # Business logic for authentication
│   │   ├── auth.schema.ts      # Mongoose schema for Auth model
│   ├── app.module.ts        # Main module importing necessary services
│   ├── app.controller.ts    # Main controller (if needed)
│   ├── app.service.ts       # Main application service (if needed)
│   ├── main.ts              # Application entry point
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
├── Dockerfile               # Docker setup for deployment
└── tsconfig.json            # TypeScript configuration
```

---

## Features Implemented

- **User Authentication**: Supports signup and login.
- **JWT-based Authentication**: Issues JWT tokens on login.
- **Role-based Access**: Assigns roles like `user` and `admin`.
- **Microservice Communication**: 
  - Runs as an **HTTP API** on port `5001`.
  - Runs a **TCP Microservice** on port `5002` for validating tokens.
- **Secure Token Management**:
  - Uses **NestJS JWT Module** for issuing and validating tokens.
  - Supports token expiration (`1 hour` validity).
- **CORS Configuration**:
  - Allows cross-origin requests from frontend (`fullstack-ten-gamma.vercel.app`).
  - Supports `GET`, `POST`, `PUT`, and `DELETE` methods.

---

## Environment Variables

Create a `.env` file in the root directory and add:

```
MONGO_URI=mongodb+srv://your-mongodb-uri
JWT_SECRET=your-secret-key
HTTP_PORT=5001
TCP_PORT=5002
```

---

## Setup & Installation

### Prerequisites

- Node.js & npm
- MongoDB (or a hosted database like MongoDB Atlas)
- Docker (optional)

### Steps to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/iqbalmdev/fullstack.git
   cd fullstack/auth-service
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the service:
   ```bash
   npm run start
   ```
4. The **Auth Service HTTP API** will be available at:
   ```
   http://localhost:5001
   ```
5. The **TCP Microservice** will be available on:
   ```
   Port 5002
   ```

---

## Run with Docker

1. Build the Docker image:
   ```bash
   docker build -t auth-service .
   ```
2. Run the container:
   ```bash
   docker run -p 5001:5001 auth-service
   ```

---

## API Endpoints

### **Authentication Routes**
| Method | Endpoint      | Description        | Body Parameters |
|--------|--------------|--------------------|----------------|
| POST   | `/auth/login` | User login        | `{ "email": "test@gmail.com", "password": "password" }` |
| POST   | `/auth/signup` | User signup      | `{ "name": "John", "email": "john@gmail.com", "password": "securepass" }` |

### **Token Validation (TCP Microservice)**
| Message Pattern | Description |
|----------------|-------------|
| `{ cmd: 'validate_token' }` | Validates JWT token |

---

## Token Management & Security

- **Token Validation**:
  - When a user logs in, they receive a **JWT**.
  - Every request requiring authentication must include this **JWT** in the `Authorization` header.
- **Token Expiration**:
  - JWT tokens are valid for `1 hour` and must be refreshed after expiration.
- **Microservice Token Validation**:
  - A **TCP microservice** validates tokens for inter-service authentication.

---

## Next Steps

- Implement **refresh token mechanism** for seamless re-authentication.
- Add **password reset functionality**.
- Enhance **logging and error handling**.

---



Here’s the **User Service README** that fits seamlessly with your frontend and auth service READMEs:  

---

# Backend - User Service (Fullstack Assignment)

## Overview-user-service

The **User Service** is a microservice responsible for managing user-related operations such as registration, retrieval, updates, and deletions. It is built using **NestJS** with **MongoDB** as the database and interacts with the **Auth Service** for token validation.  

This service provides both **HTTP APIs** and **TCP microservices** for inter-service communication.  

---

## Folder Structure

```
user-service/
├── src/                     # Source code
│   ├── user/                # User module
│   │   ├── user.controller.ts  # Handles user-related API routes
│   │   ├── user.service.ts     # Business logic for user management
│   │   ├── user.schema.ts      # Mongoose schema for User model
│   ├── app.module.ts        # Main module importing necessary services
│   ├── app.controller.ts    # Main controller (if needed)
│   ├── app.service.ts       # Main application service (if needed)
│   ├── main.ts              # Application entry point
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
├── Dockerfile               # Docker setup for deployment
└── tsconfig.json            # TypeScript configuration
```

---

## Features Implemented

- **User Management**: Create, update, delete, and retrieve users.
- **JWT-based Authentication**: Validates authentication tokens via **Auth Service**.
- **Microservice Communication**:  
  - Runs as an **HTTP API** on port `4201`.  
  - Runs a **TCP Microservice** on port `5002` for validating authentication tokens.  
- **CORS Configuration**:  
  - Allows cross-origin requests from frontend (`fullstack-ten-gamma.vercel.app`).  
  - Supports `GET`, `POST`, `PUT`, and `DELETE` methods.  
- **Soft Deletion**: Users are marked as deleted instead of being removed from the database.  

---

## Environment Variables

Create a `.env` file in the root directory and add:

```
MONGO_URI=mongodb+srv://your-mongodb-uri
HTTP_PORT=4201
TCP_AUTH_PORT=5002
```

---

## Setup & Installation

### Prerequisites

- Node.js & npm  
- MongoDB (or a hosted database like MongoDB Atlas)  
- Docker (optional)  

### Steps to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/iqbalmdev/fullstack.git
   cd fullstack/user-service
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the service:
   ```bash
   npm run start
   ```
4. The **User Service HTTP API** will be available at:
   ```
   http://localhost:4001
   ```
5. The **TCP Microservice** will be available on:
   ```
   Port 5002
   ```

---

## Run with Docker

1. Build the Docker image:
   ```bash
   docker build -t user-service .
   ```
2. Run the container:
   ```bash
   docker run -p 4001:4001 user-service
   ```

---

## API Endpoints

### **User Routes**
| Method | Endpoint       | Description            | Body Parameters |
|--------|---------------|------------------------|----------------|
| POST   | `/users`      | Create a new user      | `{ "name": "John", "email": "john@gmail.com", "password": "securepass", "interest": ["sports", "music"], "age": 25, "mobile": 1234567890 }` |
| GET    | `/users`      | Get all users          | - |
| GET    | `/users/:id`  | Get user by ID         | - |
| PUT    | `/users/:id`  | Update user details    | `{ "name": "Updated Name", "age": 30 }` |
| DELETE | `/users/:id`  | Soft delete a user     | - |

### **Token Validation (Auth Service)**
| Message Pattern | Description |
|----------------|-------------|
| `{ cmd: 'validate_token' }` | Validates JWT token |

---

## Token Management & Security

- **Token Validation**:  
  - Every request requiring authentication must include a **JWT token** in the `Authorization` header.  
  - The token is validated using the **Auth Service TCP microservice**.  
- **Soft Deletion**:  
  - Instead of removing users permanently, a `deleted: 1` flag is set.  

---

## Next Steps

- Implement **refresh token mechanism** for extended sessions.  
- Add **pagination and filtering** for user retrieval.  
- Improve **logging and monitoring** for better debugging.  

---

Here’s the updated **README** with your notes on **service communication** and **deployment**, followed by the **Docker setup instructions**.  

---

# Fullstack Assignment - Running with Docker  

## Overview  

This project consists of three services:  

1. **Frontend** (Next.js) - Runs on port `3000`.  
2. **User Service** (NestJS) - Runs on port `4201`.  
3. **Auth Service** (NestJS) - Runs on port `5001`.  

Each service is containerized using **Docker**, and they communicate via a shared Docker **network** (`app-network`).  

---

## Microservice Communication  

I initially planned to use **NestJS microservices with TCP transport** for inter-service communication. However, I faced **complications** in making TCP calls between the services.  

To **simplify** the integration and ensure smooth communication, I am currently using **HTTP requests** instead of TCP for authentication checks (such as token validation).  

**Apologies** for this workaround—I didn't have enough time to fully implement the TCP-based microservice communication.  

---

## Deployment  

The backend services (**Auth Service & User Service**) are deployed on **Render**, and the frontend is deployed on **Vercel**.  

- **Frontend (Next.js)** → Hosted on **Vercel**  
- **Backend (User & Auth Services)** → Hosted on **Render**  

You can update the **environment variables** in `.env.local` accordingly when running locally.  

---

## Running the Project with Docker  

### Prerequisites  

Ensure you have the following installed:  

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)  
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)  

---

### Steps to Run the Project  

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/iqbalmdev/fullstack.git
   cd fullstack
   ```

2. **Create a `.env` file** for environment variables:  
   ```bash
   touch .env
   ```

   Add the following to the `.env` file:  
   ```
   NEXT_PUBLIC_AUTH_URL=http://localhost:5001
   NEXT_PUBLIC_USER_URL=http://localhost:4001
   ```

3. **Run the project using Docker Compose**  
   ```bash
   docker-compose up --build
   ```

   This will:  
   - Build and start **Frontend (Next.js)**  
   - Build and start **User Service (NestJS)**  
   - Build and start **Auth Service (NestJS)**  

4. **Access the services** in your browser:  
   - **Frontend:** [http://localhost:3000](http://localhost:3000)  
   - **User Service:** [http://localhost:4201](http://localhost:4001)  
   - **Auth Service:** [http://localhost:5001](http://localhost:5001)  

---

### Stopping the Containers  

To stop all running containers, use:  
```bash
docker-compose down
```

This will gracefully shut down all services and free up ports.  

---

## Notes  

- The **Frontend** fetches data from the **User & Auth Services** using the provided API URLs.  
- Authentication token validation is done via **HTTP requests**, not TCP.  
- The backend is **deployed on Render**, while the frontend is **deployed on Vercel**.  

---

This README provides clear **steps for running the project locally using Docker** and mentions the **service communication workaround**. Let me know if you need any changes! 🚀




