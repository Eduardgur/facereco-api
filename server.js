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

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    db('login')
    .where({ email: email })
    .select('hash')
    .then(hash => {
        console.log(hash[0]);
        if (hash[0] === undefined) {
            res.status(400).json({
                err: 'Cant find email',
            });
        } else {
            bcrypt.compare(password, hash[0].hash, (bres, err) => {
                console.log('res: ', bres);
                console.log('err: ', err);                
                if (err) {
                    db('users').where({email: email}).then(user => {
                        res.status(200).json({
                            user: user,
                            response: 'Welcome',
                        });
                    });
                } else {
                    res.status(400).json({
                        err: 'Username or Password dont match'
                    });
                }
                
            });
        }
    });
    

    
});

app.post('/signup', (req, res) => {
    let { email, name, password } = req.body;
    if (name === '') {
        name = null;
    }
    if (email === '') {
        email = null;
    }
    bcrypt.hash(password, null, null, (err, hash) => {
        db('users').returning('*').insert({
            email: email,
            name: name,
            join_date: new Date(),
        }).then(user =>{
            console.log('users: ', user);
            db('login').returning('*').insert({
                email: email,
                hash: hash,
            }).then (login => {
                console.log('login: ', login);
                
            })
            res.json({
                user: user,
                response: 'Account has been created seccessfuly',
            });
        }).catch(usrresp => {
            console.log('user switch: ', usrresp);
            switch (usrresp.code) {
                case '23514' :
                    res.status(400).json({
                        err: 'Incorrect email format.'
                    })
                    break;
                case '23505':
                    res.status(400).json({
                        err: 'Email already exists.'
                    });
                    break;
                case '23502' :
                    res.status(400).json({
                        err: 'Fields cant be empty.'
                    });
                    break;
                default :
                    console.log('error switch: ', usrresp);
                    res.status(400).json({
                        err: 'Error'
                    });
            }
        });
    })
});

app.get('/profile/:id', (req, res) => {    
    const { id } = req.params;
    let idFound = false;
    database.users.forEach(user => {
        if (id === user.id) {
            idFound = true;
            return res.json(user);
        }
    });
    if (!idFound) {
        res.status(400).json('Can find profile');
        }
    });
    
app.put('/image', (req, res) => {
    const { id } = req.body;
    let idFound = false;
    database.users.forEach((user, i, users) => {
        if (id === user.id) {
            idFound = true;
            users[i].enteries++;
            return res.json(user.enteries);
        } 
    });
    if (!idFound) {
            res.status(400).json('Can find profile');
        }
    });
    
app.listen(backendPort, () => {
    console.log(`app is running on port ${backendPort}`);
});
