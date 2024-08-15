const { z } = require('zod');
const { createTable } = require('drizzle-orm');

// Define the schema
const userSchema = createTable('users', {
  id: {
    type: 'uuid',
    default: 'gen_random_uuid()',
    primaryKey: true,
  },
  email: {
    type: 'varchar',
    unique: true,
    notNull: true,
  },
  username: {
    type: 'varchar',
    unique: true,
    notNull: true,
  },
  is_verified: {
    type: 'boolean',
    default: false,
  },
  verification_factor: {
    type: 'uuid',
    foreignKey: 'verification_factors.id',
  },
  sockets: {
    type: 'jsonb',
    default: '[]',
  },
  profileUrl: {
    type: 'varchar',
    default: null,
  },
  password: {
    type: 'varchar',
    notNull: true,
  },
  passwordResetToken: {
    type: 'varchar',
    default: null,
  },
  passwordResetTokenExpiry: {
    type: 'timestamp',
    default: null,
  },
  createdAt: {
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
    notNull: true,
  },
  updatedAt: {
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    notNull: true,
  },
});

module.exports = userSchema;
