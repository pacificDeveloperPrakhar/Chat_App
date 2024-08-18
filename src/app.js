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
    origin: '*',                      // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allow common HTTP methods
    credentials: true,                 // Allow credentials like cookies
    allowedHeaders: ['Content-Type', 'Authorization']  // Allowed headers
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

// POST route to insert fruit data
app.post('/fruits', async (req, res, next) => {
    const { quantity, color, name } = req.body;
    
    try {
        // Insert fruit data into the database
        const data = await db.insert(fruits).values({
            name, color, quantity
        });
        
        // Send a response with the inserted data
        res.send(data);
    } catch (error) {
        next(error); // Pass errors to the error-handling middleware
    }
});
app.use((req,res,next)=>{
    console.log("app file has been executed")
})

const io =  Socket(server, {
    cors: {
      origin: "*", // Allow all origins for development
      methods: ["GET", "POST"]
    },
    path:"/chat"
  });  
// this namespace will be used for online and offline feature and also sending the users available  to the one user
const headerNmsp=io.of("/%HEADERS%")
// setting up the session middleware for the socket incomming
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: 14 * 24 * 60 * 60, // 14 days
      autoRemove: 'native',
    }),
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    },
  });
  // this namespace will be used for online and offline feature and also sending the users available  to the one user

  headerNmsp.use((socket,next)=>{
   next()
  })
  headerNmsp.use(extractUser);
  // now for the header namespace logic
  headerNmsp.on("connection",async(socket)=>{
        // this will help us to see if the user is online or offline
    // if the user is offline then its socket array will be empty otherwise
    // it will contain something
    const users=await getSocketUsers({})
    headerNmsp.emit("new_socket_connection",users)
    console.log(socket.request.user)
    await socketConnectedToUser(socket?.request?.user?.id,socket.id)
    console.log("connected to the socket header namespace")
    // disconnecting from the user
    socket.on('disconnect', async() => {
      console.log(socket.id,"it is disconnected")
      await socketDisconnectedFromUser(socket?.request?.user?.id,socket.id)
      const users=await getSocketUsers({})
    headerNmsp.emit("new_socket_connection",users)
      console.log('User disconnected:', socket.id);
    });
  })
  
  // to use the express middleware for the session
  io.engine.use(sessionMiddleware);
  // assigning a middlware for the incomming connection
  //this is to authenticate the connection
  //

  io.use(extractUser);

  io.on('connection', async (socket) => {

  
  console.log("connected")
    // Listen for incoming chat messages
    socket.on('chatMessage', (msg) => {
      if (socket.user) {
        io.emit('chatMessage', { user: socket.user.username, message: msg });
      }
    });
  
    // Handle user disconnects
    socket.on('disconnect', async() => {
      console.log('User disconnected:', socket.id);
    });
  });
  clearSocketArrays()
// Export the app module
module.exports = server;
