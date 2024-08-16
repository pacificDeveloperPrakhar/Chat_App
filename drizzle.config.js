const { defineConfig } = require('drizzle-kit');

module.exports = defineConfig({
    dialect: "postgresql",
    schema: './src/db/schema/schema.js',
    out: './src/db/drizzle',
    // 'postgresql' | 'mysql' | 'sqlite'
    dbCredentials: {
        host: process.env.postgres_db_host,
        user: process.env.postgres_db_user,
        password: process.env.postgres_db_password,
        database: process.env.postgres_db,
    },
    verbrose:true,
    strict:true
});
