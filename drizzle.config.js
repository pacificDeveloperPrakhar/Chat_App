const { defineConfig } = require('drizzle-kit');

module.exports = defineConfig({
    dialect: "postgresql",
    schema: './db/schema',
    out: './drizzle',
    // 'postgresql' | 'mysql' | 'sqlite'
    dbCredentials: {
        host: "127.0.0.1",
        user: "postgres",
        password: "pop4321",
        database: "postgres_learn",
    },
});
