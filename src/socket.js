const server = require("./app.js");
const Socket = require('socket.io');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { socketConnectedToUser, socketDisconnectedFromUser, clearSocketArrays, getSocketUsers,getTheConversations,getAllConversations,createRoomForConversation } = require("./utils/socketUtils.js");
const { extractUser } = require("./controllers/socketController.js");
const { message } = require("./db/schema/schema.js");

const socketCollection={}
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
    headerNmsp.emit("new_socket_connection", {users});
    console.log("connected to the socket header namespace");
    
    socket.on('disconnect', async () => {
        delete socketCollection[socket.id]
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
    // initiating conversation
    socketCollection[socket.id]=socket
    await socketConnectedToUser(socket?.request?.user?.id, socket.id);
    // this is for the creations of room
    socket.on("create_conversations",async(payload)=>{
        const {me,users}=payload
        const conversation=await getTheConversations(me,users)
        
        await createRoomForConversation(conversation,io,socketCollection)
        
    })
    socket.on('chatMessage', (msg) => {
        if (socket.user) {
            io.emit('chatMessage', { user: socket.user.username, message: msg });
        }
    });
    
    socket.on('disconnect', async () => {
        delete socketCollection[socket.id]
        console.log('socket disconnected:', socket.id);
    });
    const conversations=await getAllConversations(socket?.request?.user.id);
    conversations.forEach(conversation=>socket.join(conversation?.roomName))
    socket.emit("all_conversations_registered",conversations)
});

// Clear socket arrays on server start
clearSocketArrays();
