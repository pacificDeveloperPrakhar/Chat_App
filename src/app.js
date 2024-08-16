const express=require("express")
const profileRoutes=require("./routes/profileRoutes.js")
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app=express()
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,                      
    saveUninitialized: true,           // will create the session once it is modified
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,  // MongoDB connection URL
      collectionName: 'sessions',        // Custom collection name
      ttl: 14 * 24 * 60 * 60,           // will remove the session after 14 days
      autoRemove: 'native'              // this will remove the expired session automatically
    }),
    cookie: {
      secure: false,                    // Set to true if using HTTPS
      maxAge: 14 * 24 * 60 * 60 * 1000  // cookie expiration time is 14 days
    }
  }));
app.use(express.json())
app.use("/profiles",profileRoutes)
module.exports=app