require('dotenv').config();

const { Client } = require('pg');

const SQL = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, email VARCHAR(255), password VARCHAR(255))';

const connection = new Client({
    connectionString: `postgresql://neondb_owner:${process.env.DB_PASSWORD}@ep-rapid-shadow-a8kjdx3c.eastus2.azure.neon.tech/neondb?sslmode=require`
});

async function main(){
    console.log('Populating...');
    await connection.connect();
    await connection.query(SQL);
    await connection.end()
    console.log('Done!')
}

main();