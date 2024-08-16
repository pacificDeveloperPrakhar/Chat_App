const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { db } = require('../db_connection.js');

const migrateData=async function migrateData() {
    try {
        await migrate(db, { migrationsFolder: './src/db/drizzle' });
        console.log("Migrated successfully");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
exports.migrateData=migrateData
migrateData();
