// Importing the necessary modules using CommonJS
const { integer, pgEnum, pgTable, uniqueIndex, varchar, boolean, timestamp, jsonb, uuid } = require('drizzle-orm/pg-core');
const { v4: uuidv4 } = require('uuid');  // Properly import uuidv4 function
const { and } = require('drizzle-orm');

// Declaring an enum for user status
const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'banned']);

// Creating the users table
const users = pgTable('users', {
  id: uuid('id').default(uuidv4()).primaryKey(),  // Use UUID for ID
  email: varchar('email', { length: 256 }).unique(),
  username: varchar('username', { length: 256 }).unique(),
  is_verified: boolean('is_verified').default(false),
  profileUrl: varchar('profile_url', { length: 512 }).default(null),
  userStatus: userStatusEnum('user_status').default('inactive'),  // Default value set to 'inactive'
  createdAt: timestamp('created_at').defaultNow(),  // Changed to defaultNow()
  // changed the timestamp syntax caution do not use the javascript database.now as it will raise the error
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),  
  socketConnected: jsonb('socket_connected').notNull().default('[]'),
  // Use JSONB for socket connections
  password:varchar("password").notNull()  ,
  
  // For the password reset token and verification
  passwordResetToken: varchar('password_reset_token', { length: 255 }).default(null),
  passwordResetExpires: timestamp('password_reset_expires').default(null), // Expiration time for reset token
  
}, (users) => {
  return {
    emailIndex: uniqueIndex('email_idx').on(users.email),
    usernameIndex: uniqueIndex('username_idx').on(users.username),
  };
});

// Creating the verification_factors table
const verification_factors = pgTable('verification_factors', {
  id: uuid('id').default(uuidv4()).primaryKey(),  // Use UUID for ID
  profileId: uuid('profile_id').references(() => users.id),  
  value: varchar('value', { length: 512 }).default(null),
  createdAt: timestamp('created_at').defaultNow(),  
  expiresAt: timestamp('expires_at').defaultNow(),  
  isValid: boolean('is_valid').default(true),
  isUsed: boolean('is_used').default(false)
}, (verification_factors) => {
  return {};
});

// Exporting the modules using CommonJS
module.exports = {
  userStatusEnum,
  users,
  verification_factors
};
