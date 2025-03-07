require('dotenv').config();

const {Pool} = require('pg');

const pool = new Pool({
    connectionString: `postgresql://neondb_owner:${process.env.DB_PASSWORD}@ep-rapid-shadow-a8kjdx3c-pooler.eastus2.azure.neon.tech/neondb?sslmode=require`
})

module.exports = pool;