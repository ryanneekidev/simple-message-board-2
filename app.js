const express = require('express');

const app = express();

app.get('/', (req, res)=>{
    res.status(200).send('Hello, World!')
})

app.listen(3000, (req, res)=>{
    console.log('Server started at http://127.0.0.1:3000')
})