const app = require("./src/app");
const http = require("http");
const server = http.createServer(app);

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});
const get_connection_url = require("./src/utils/get_connection_url");
server.listen(1234, "192.168.29.40", (err) => {
  if (!err) console.log("server is listening on http://192.168.29.40:1234");
});
const url = get_connection_url(process.env.text_editor, process.env.user, process.env.password);
console.log(url)

mongoose.connect(url).catch((err) => console.log("error encoutered"));
const db = mongoose.connection;
db.once("open", () => {
  console.log("connected to the port");
  const portused = db.port;
  console.log("Port used for mongoDB connection:", portused);
});
db.on("error", (err) => {
  console.log(err);
});
process.on("unhandledRejection", (err) => {
  console.log(err);
  server.close(() => {
    process.exit();
  });
});
process.on("uncaughtException", (err) => {
  console.log(err);
  server.close(() => {
    process.exit();
  });
});
