const { z } = require('zod');
const { createTable } = require('drizzle-orm');

// Define the schema
const profileSchema = createTable('users', {
  id: {
    type: 'uuid',
    default: 'gen_random_uuid()',
    primaryKey: true,
    // Unique identifier for the user, automatically generated UUID
  },
  email: {
    type: 'varchar',
    unique: true,
    notNull: true,
    // User's email address, must be unique and not null
  },
  username: {
    type: 'varchar',
    unique: true,
    notNull: true,
    // User's username, must be unique and not null
  },
  is_verified: {
    type: 'boolean',
    default: false,
    // Indicates whether the user's email has been verified
  },
  verification_factor: {
    type: 'uuid',
    foreignKey: 'verification_factors.id',
    // Foreign key linking to a verification factor, used for email or account verification
  },
  sockets: {
    type: 'jsonb',
    default: '[]',
    // Stores an array of objects representing active sockets or connections for real-time communication
  },
  profileUrl: {
    type: 'varchar',
    default: null,
    // URL of the user's profile picture, optional
  },
  password: {
    type: 'varchar',
    notNull: true,
    // User's hashed password, must not be null
  },
  passwordResetToken: {
    type: 'varchar',
    default: null,
    // Token used for password reset functionality, optional
  },
  passwordResetTokenExpiry: {
    type: 'timestamp',
    default: null,
    // Expiry time for the password reset token, optional
  },
  createdAt: {
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
    notNull: true,
    // Timestamp of when the record was created, automatically set to the current time
  },
  updatedAt: {
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    notNull: true,
    // Timestamp of the last update to the record, automatically updated to the current time on modification
  },
});

module.exports = profileSchema;
