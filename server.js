const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" }); // Load environment variables from config.env file
const server=require("./src/app.js")
// importing the connection file to connect with the postgres databse
const db_postgres=require("./src/db/db_connection.js")
require("./src/db/migrate/migrate")
const host = process.env.host; 
const port = process.env.port; 
const io=require("./src/socket.js")
// If there is an unhandled promise rejection, log the error and shut down the server gracefully
process.on("unhandledRejection", (err) => {
  console.log(err);
  server.close(() => {
    process.exit();
  });
});

// If there is an uncaught exception, log the error and shut down the server gracefully
process.on("uncaughtException", (err) => {
  console.log(err);
  server.close(() => {
    process.exit();
  });
});

// Get MongoDB connection URL

mongoose.connect(process.env.mongodb_url).catch((err) => console.log("error encountered")); // Connect to MongoDB
const db = mongoose.connection;

db.once("open", () => {
  const portused = db.port; // Port used for MongoDB connection
  console.log("\033[104mPort used for mongoDB connection:\033[0m", portused);
});

db.on("error", (err) => {
  console.log(err); // Log any MongoDB connection errors
});

// Start the server and listen on specified host and port
server.listen(port, host, (err) => {
    if (err) {
      console.error(`\x1b[31mError starting the server: ${err}\x1b[0m`); // Red text for error
    } else {
      console.log(
        `\x1b[1m\x1b[32mServer is listening on \x1b[36mhttp://${host}:${port}\x1b[0m`
      );
    }
  });
  

// New Features

// Graceful shutdown on SIGINT signal (Ctrl+C)
process.on('SIGINT', () => {
  console.log("\nclosing the server....");
  server.close(() => {
    console.log("Server closed");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});

// Graceful shutdown on SIGTERM signal (e.g., kill command)
process.on('SIGTERM', () => {
  console.log("\nshutting the server....");
  server.close(() => {
    console.log("Server closed");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});