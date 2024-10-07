const server = require("./app.js")
const Socket = require('socket.io')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const { socketConnectedToUser, socketDisconnectedFromUser, clearSocketArrays, getSocketUsers, getTheConversations, getAllConversations, createRoomForConversation,storeChatAndEmit} = require("./utils/socketUtils.js")
const { extractUser } = require("./controllers/socketController.js")
const { message } = require("./db/schema/schema.js")

const socketCollection = {}

// Start Socket.IO server
const io = Socket(server, {
    cors: {
        origin: ['http://localhost:3000','http://localhost:1234'],
        methods: ["GET", "POST"],
        optionsSuccessStatus: 200,
        credentials:true
    },
    path: "/chat"
})

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
})

// Attach session middleware to engine
io.engine.use(sessionMiddleware)
io.engine.use((req,res,next)=>{
    console.log("handshake has been initiated")
    next()
})
// Global middleware for all namespaces
io.use(extractUser)

io.on('connection', async (socket) => {
        // Register all conversations the user is part of

        const conversations = await getAllConversations(socket?.request?.user.id)
        conversations.forEach(conversation => socket.join(conversation?.roomName))
        socket.emit("all_conversations_registered", conversations)

        await socketConnectedToUser(socket?.request?.user?.id, socket.id)
        const users = await getSocketUsers({})
        
        io.emit("new_socket_connection", { users })
        console.log("socket_connected :",socket.id)
    // Store the socket reference in the collection
    socketCollection[socket.id] = socket

    // Conversation initiation
    socket.on("create_conversations", async (payload) => {
        const { me, users } = payload
        const conversation = await getTheConversations(me, users)
        await createRoomForConversation(conversation, io, socketCollection)
    })

    // Chat message handling
    socket.on('chatMessage', async (mssg) => {
        await storeChatAndEmit(socket,io,mssg)
    })
    // to handle the typing and and the in chat feature
    socket.on("state_changed_for_room",(state_respnse)=>{
        socket.in(state_respnse.conversationId).emit("state_changed_for_room",state_respnse)
    })
    // Handle disconnection
    socket.on('disconnect', async () => {
        await socketDisconnectedFromUser(socket?.request?.user?.id, socket.id)
        const updatedUsers = await getSocketUsers({})
        io.emit("new_socket_connection", {users:updatedUsers})
        delete socketCollection[socket.id]
        console.log('socket disconnected:', socket.id)
    })
    socket.on("user_changed",async()=>{
        io.emit("new_socket_connection", { users })
    })
})

// Clear socket arrays on server start
clearSocketArrays()
