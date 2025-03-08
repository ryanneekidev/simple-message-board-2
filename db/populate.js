require('dotenv').config();

const { Client } = require('pg');

const SQL = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, email VARCHAR(255), password VARCHAR(255), secret_club BOOLEAN)';
const SQL2 = 'CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, content VARCHAR(255), poster_id INTEGER, date VARCHAR(255, FOREIGN KEY (poster_id) REFERENCES users(id))'

const connection = new Client({
    connectionString: `postgresql://neondb_owner:${process.env.DB_PASSWORD}@ep-rapid-shadow-a8kjdx3c.eastus2.azure.neon.tech/neondb?sslmode=require`
});

async function main(){
    console.log('Populating...');
    await connection.connect();
    await connection.query(SQL);
    await connection.query(SQL2);
    await connection.end();
    console.log('Done!')
}

main();