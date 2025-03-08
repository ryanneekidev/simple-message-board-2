const pool = require('./pool');

async function getUsers(){
    const SQL = 'SELECT * FROM users';
    const { rows } = await pool.query(SQL);
    return rows;
}

async function createUser(email, password){
    const SQL = 'INSERT INTO users (email, password) VALUES ($1, $2)';
    await pool.query(SQL, [email, password]);
}

async function getMessages(){
    const SQL = 'SELECT * FROM messages';
    const {rows} = await pool.query(SQL);
    return rows;
}

async function getMessagesAndAuthors(){
    const SQL = 'SELECT users.id, content, email AS poster, date FROM messages JOIN users ON messages.poster_id = users.id';
    const {rows} = await pool.query(SQL);
    return rows;
}

async function postMessage(content, poster_id, date){
    const SQL = 'INSERT INTO messages (content, poster_id, date) VALUES ($1,$2,$3)';
    await pool.query(SQL, [content, poster_id, date])
}

async function promoteUser(id){
    const SQL = 'UPDATE users SET secret_club=TRUE WHERE id=$1';
    await pool.query(SQL, [id])
}

module.exports={
    getUsers,
    createUser,
    getMessages,
    getMessagesAndAuthors,
    postMessage,
    promoteUser
}