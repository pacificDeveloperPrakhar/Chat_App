# Chat Application Backend

A backend implementation for a real-time chat application supporting both one-to-one and multi-user conversations. This project leverages Node.js, Express, Drizzle ORM, Mongoose, and Passport for Google authentication.

## Tech Stack

- **Node.js**: JavaScript runtime for the server-side code.
- **Express.js**: Web framework for creating RESTful APIs.
- **Drizzle ORM**: For managing database DDL and querying PostgreSQL.
- **Mongoose**: To handle session storage in MongoDB.
- **Passport.js**: For user authentication using Google OAuth.
- **CommonJS**: For module management in Node.js.

## Features

- **One-to-One Chat**: Real-time messaging between two users.
- **Multi-User Chat**: Group chat support with multiple participants.
- **Google OAuth Authentication**: Secure login using Google accounts via Passport.js.
- **Session Management**: Sessions are stored in MongoDB using Mongoose.
- **Database Management**: PostgreSQL database schema and queries handled by Drizzle ORM.

part 1:setting up the postgres and updating the schema
## Documentation for SQL Generated Query File

This SQL generated query file includes queries to create tables for users, verifications, conversations, and messages. The user table stores user information, while the verification table is used for email verification and password resetting. The conversation table stores information related to conversations and rooms, and the message table is used for storing messages.

### User and Verification Tables

The queries in this file include the creation of the user table with indexes on email and username fields. The verification table is also created, but since these tables already exist, the queries related to them are skipped.

### Conversation and Message Tables

Additionally, the file contains queries to create the conversation and message tables. These tables store conversation-related information and messages, respectively.

### Socket File

The socket file is responsible for managing socket connections and disconnections. It handles actions to be performed before and after disconnection using asynchronous callback functions.

### Creating Conversations

The socket file includes logic to create conversations. It takes user credentials as the first parameter and an array of users the person is trying to talk to. This information is used to create a participant array with participant IDs.

### Updating Conversation Schema

The conversation schema has been updated to include fields for room name, participant, participant ID, profile URL, and users ID. The logic for creating conversations has been modified accordingly.

### Frontend Setup

The frontend is built using the Parcel template. Script files will be set up once all major tasks are completed.

### Additional Notes

Before further operations, ensure that the socket file is properly set up. Once all tasks are completed, script files will be configured for the frontend. 