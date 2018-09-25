const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const database = {
    users : [
        {
            id: '1',
            name: 'ed',
            password: 'eded',
            email: 'ed@ed.com',
            enteries: 0,
            joined: new Date(),
        },
        {
            id: '2',
            name: 'gu',
            password: 'gugu',
            email: 'gu@gu.com',
            enteries: 0,
            joined: new Date(),
        },
    ],
}



app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
            res.json('login success');        
    } else {
        res.status(400).json('login error');
    }
});

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    database.users.push(
        {
            name: name,
            email: email,
            password: password,
            enteries: 0,
            id: new Date().getTime(),
            joined: new Date(),
        }
    );
    res.json('user added');
    console.log(database.users[database.users.length - 1]);
});

app.get('/profile/:userid', (req, res) => {
    
});

app.put('/image', (req, res) => {
    
});

app.listen(3000, () => {
    console.log('app is running on port 3000');
    
});