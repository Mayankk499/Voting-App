const express = require('express')
const app = express();
// require('dotenv').config();

const bodyParser = require('body-parser');
const { prototype } = require('events');
const { log } = require('console');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
    
})