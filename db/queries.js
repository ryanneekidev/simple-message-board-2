const pool = require('./pool');

async function getUsers(){
    const SQL = 'SELECT * FROM users';
    const { rows } = await pool.query(SQL);
    return rows;
}

module.exports={
    getUsers
}