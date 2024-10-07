
const { drizzle } = require('drizzle-orm/node-postgres');
const pg = require('pg');       
const dotenv = require("dotenv");
require("./schema/schema.js")
// Create a new PostgreSQL client
const client = new pg.Client({
  host: process.env.postgres_db_host,
  port: process.env.postgres_db_port,
  user: process.env.postgres_db_user,
  password: process.env.postgres_db_password,
  database: process.env.postgres_db,
});

// Connect to the database and log the connection status
client.connect()
  .then(() => console.log(`connected to the postgres database ${process.env.postgres_db}`))
  .catch(err => console.log(err));

// Export the database instance
// you can use this other object to create custom log such as logging
// queries whene rhey are executed
const db = drizzle(client,{});

module.exports = { db };
