const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const backendPort = 3001;
const knex = require('knex');
const db = knex({
    client: 'pg',
    connection: {
        host: `localhost`,
        user: 'postgres',
        password: '021021021',
        database: 'facereco_db',
    }
});
const signup = require('./controllers/signup');
const signin = require('./controllers/signin');
const getProfile = require('./controllers/getProfile');
const getFaces = require('./controllers/getFaces');


const app = express();
app.use(bodyParser.json());
app.use(cors());


app.post('/signin',  signin.handleSignin(db, bcrypt));
app.post('/signup', signup.handleSignup(db, bcrypt));
app.get('/profile/:id', getProfile.handleGetProfile(db));
app.put('/getFaces', getFaces.handleGetFaces(db));
app.listen(backendPort, () => {
    console.log(`app is running on port ${backendPort}`);
});