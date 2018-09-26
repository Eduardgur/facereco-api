const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '1',
            name: 'ed',
            email: 'ed@ed.com',
            enteries: 0,
            joined: new Date(),
        },
        {
            id: '2',
            name: 'gu',
            email: 'gu@gu.com',
            enteries: 0,
            joined: new Date(),
        },
    ],
    logins: []
}

bcrypt.hash('eded', null, null, (err, hash) => {
    database.logins.push(
        {
            id: '1',
            hash: hash,
            email: 'ed@ed.com',
        }
    );
});

bcrypt.hash('gugu', null, null, (err, hash) => {
    database.logins.push(
        {
            id: '2',
            hash: hash,
            email: 'gu@gu.com',
        }
    );
});

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    let found = false;
    console.log(req.body);
    
    database.logins.forEach(login => {
        if (email === login.email && bcrypt.compareSync(password, login.hash)) {
            found = true;  
            database.users.forEach(user => {
                if (login.id === user.id)
                return res.json(user);
            })
        }
    });
    if (!found) {
        res.status(400).json('login error');
    }
});

app.post('/signup', (req, res) => {
    const { email, name, password } = req.body;
    const idByTime = new Date().getTime();

    bcrypt.hash(password, null, null, (err, hash) => {
        database.logins.push({
                id: idByTime,
                email: email,
                hash: hash,
            });
    });

    database.users.push({
            name: name,
            email: email,
            enteries: 0,
            id: idByTime,
            joined: new Date(),
        });
    res.json('user added');
    console.log('user: ', database.users[database.users.length - 1]);
    setTimeout(()=>console.log('logins: ', database.logins[database.logins.length - 1]),3000);
    
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
    console.log('image: ', req.body);
    
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

app.listen(3001, () => {
    console.log('app is running on port 3001');
});