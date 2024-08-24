const express = require("express");
const profileRoutes = require("./routes/profileRoutes.js");
const session = require('express-session');
const cors = require('cors');
const { users, verification_factors, fruits } = require("./db/schema/schema.js");
const { db } = require("./db/db_connection");
const MongoStore = require('connect-mongo');
const app = express();
const http = require("http");
const server = http.createServer(app); 
const Socket = require('socket.io');
const { user } = require("pg/lib/defaults.js");
const { eq } = require("drizzle-orm");
const { socketConnectedToUser, socketDisconnectedFromUser, clearSocketArrays ,getSocketUsers} = require("./utils/socketUtils.js");
const { extractUser } = require("./controllers/socketController.js");

// Initialize Express app

// Enable CORS for all origins and HTTP methods

app.use(cors({
    origin: '*',  // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  
    allowedHeaders: ['Content-Type', 'Authorization'],  
    credentials: true ,
    optionsSuccessStatus:200
  }));

// Session configuration with MongoDB for session storage
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false, // to save the existing session once it is modified and not create new one
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,  // MongoDB connection URL
        collectionName: 'sessions',       // Custom collection name
        ttl: 14 * 24 * 60 * 60,           // will remove the session after 14 days
        autoRemove: 'native'              // this will remove the expired session automatically
    }),
    cookie: {
        secure: false,                    // Set to true if using HTTPS
        maxAge: 14 * 24 * 60 * 60 * 1000  // Cookie expiration time is 14 days
    }
}));
// Middleware to parse JSON request bodies
app.use(express.json());

// Route handling for profile-related actions
app.use("/profiles", profileRoutes);
// Export the app module
module.exports = server;
