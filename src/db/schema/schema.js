const { integer, pgEnum, pgTable, uniqueIndex, varchar, boolean, timestamp, jsonb, uuid } = require('drizzle-orm/pg-core');
const { v4: uuidv4 } = require('uuid');
const { and } = require('drizzle-orm');

// Declaring an enum for user status
const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'banned']);

// Creating the users table
const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 256 }).unique(),
  username: varchar('username', { length: 256 }).unique(),
  is_verified: boolean('is_verified').default(false),
  profileUrl: varchar('profile_url', { length: 512 }).default(null),
  userStatus: userStatusEnum('user_status').default('inactive'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
  socketConnected: jsonb('socket_connected').notNull().default('[]'),
  password: varchar("password").notNull(),
  passwordResetToken: varchar('password_reset_token', { length: 255 }).default(null),
  passwordResetExpires: timestamp('password_reset_expires').default(null),
}, (users) => {
  return {
    emailIndex: uniqueIndex('email_idx').on(users.email),
    usernameIndex: uniqueIndex('username_idx').on(users.username),
  };
});

// Creating the verification_factors table
const verification_factors = pgTable('verification_factors', {
  id: uuid('id').defaultRandom().primaryKey(),
  profileId: uuid('profile_id').references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  value: varchar('value', { length: 512 }).default(null),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at').defaultNow(),
  isValid: boolean('is_valid').default(true),
  isUsed: boolean('is_used').default(false),
}, (verification_factors) => {
  return {};
});

// Creating the conversations table
const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  roomName: varchar('room_name', { length: 255 }).notNull(),
  participants: jsonb('participants').notNull().default('[]'),
}, (conversations) => {
  return {};
});

// Creating the message table
const message = pgTable("message", {
  id: uuid("id").defaultRandom().primaryKey(),
  senderId: uuid('senderId').references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  text: varchar('text', { length: 255 }),
  file: varchar("file", { length: 255 }),
  conversationsId: uuid('conversationsId').references(() => conversations.id, { onDelete: "cascade", onUpdate: "cascade" }),
  targettedUser: jsonb("targettedUser").default('[]').notNull(),//targettedUser will have [{userId,readAt}]
  sendAt:timestamp('send_at').defaultNow(),
});


module.exports = {
  userStatusEnum,
  users,
  verification_factors,
  conversations,
  message,  
};
