const express = require("express");
const profileRoutes = require("./routes/profileRoutes.js");
const session = require('express-session');
const cookieParser=require("cookie-parser")
const cors = require('cors');
const MongoStore = require('connect-mongo');
const app = express();
const path=require("path")
const http = require("http");
const server = http.createServer(app); 
const conversationRoute=require("./routes/conversationRoute.js")
const device=require("express-device");
app.use(cookieParser())
// itialize Express app
app.use(device.capture())
// this is for the cors ,enabling the cors extension or if u use any sort of extension then it might hinder with how your preflight 
// response and may give u an error so if u encounter any error while performing an http request make sure to disable it
app.use(cors({
    origin: ['http://127.0.0.1:3000','http://127.0.0.1:1234'],  // i have changed it to allow it to accept request from one specific source only
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
app.use("/conversation", conversationRoute);
app.use("/static_files",express.static(path.resolve(__dirname,"../frontend2/public_dir")))
console.log(path.resolve(__dirname,"../frontend2/public_dir"))
//for if client encounters the 404 error
app.use((req,res,next)=>{
    res.status(404).json({
        "status code":404,
        status:"not found",
        data:{},
        message:"route requested is not specified on the server side",
        fromDeveloper:"this program was made entirely by the author:prakhar vishwakarma,if u like this app make sure to appreciate the work"

    })
})
// error handling route
app.use((err,req,res,next)=>{
    const error=({stack:err.stack,message:err.message,name:err.name,...err})
    err["status code"]=err["status code"]||500;
    res.status(err['status code']).json({...error})
    
})
// Export the app module
module.exports = server;
