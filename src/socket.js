const server = require("./app.js");
const Socket = require('socket.io');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { socketConnectedToUser, socketDisconnectedFromUser, clearSocketArrays, getSocketUsers,getTheConversations,getAllConversations } = require("./utils/socketUtils.js");
const { extractUser } = require("./controllers/socketController.js");
const { message } = require("./db/schema/schema.js");

// Start Socket.IO server
const io = Socket(server, {
    cors: {
        origin: "*", // Allow all origins for development
        methods: ["GET", "POST"],
        optionsSuccessStatus: 200
    },
    path: "/chat"
});

// Header namespace for online/offline features
const headerNmsp = io.of("/%HEADERS%");

// Setup session middleware for Socket.IO
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

// Apply session middleware to the namespace
headerNmsp.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
});

// Middleware for extracting user
headerNmsp.use(extractUser);

// Namespace connection logic
headerNmsp.on("connection", async (socket) => {
    await socketConnectedToUser(socket?.request?.user?.id, socket.id);
    const users = await getSocketUsers({});
    const conversations=getAllConversations(socket?.request?.user.id);
    headerNmsp.emit("new_socket_connection", {users,conversations});
    console.log("connected to the socket header namespace");

    socket.on('disconnect', async () => {
        await socketDisconnectedFromUser(socket?.request?.user?.id, socket.id);
        const updatedUsers = await getSocketUsers({});
        headerNmsp.emit("new_socket_connection", updatedUsers);
        console.log('User disconnected:', socket.id);
    });
});

// Attach session middleware to engine
io.engine.use(sessionMiddleware);

// Global middleware for all namespaces
io.use(extractUser); 

io.on('connection', async(socket) => {
    console.log("connected");
    // this is for the creations of room
    socket.on("create_conversations",async(payload)=>{
        console.log("something happend")
     const {me,users}=payload
     const conversation=await getTheConversations(me,users)
     socket.emit("create_conversations",conversation)
     
    })
    socket.on('chatMessage', (msg) => {
        if (socket.user) {
            io.emit('chatMessage', { user: socket.user.username, message: msg });
        }
    });

    socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);
    });
});

// Clear socket arrays on server start
clearSocketArrays();
