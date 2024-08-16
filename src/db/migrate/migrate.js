const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { db } = require('../db_connection.js');

const migrateData=async function migrateData() {
    try {
        await migrate(db, { migrationsFolder: './src/db/drizzle' });
        console.log("Migrated successfully");
    } catch (err) {
        console.error(err);
    }
}
exports.migrateData=migrateData
migrateData();
