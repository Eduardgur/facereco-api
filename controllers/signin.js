const handleSignin = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;
    db('login')
    .where({ email: email })
    .select('hash')
    .then(dbres => {
        bcrypt.compare(password, dbres[0].hash, (bres, err) => {
            if (err) {
                db('users')
                    .select('*')
                    .where({email: email})
                    .then(user => {
                        res.json({
                            user: user[0],
                            response: 'Welcome',
                        });
                    }).catch(err => {
                        res.status(400).json({err: 'Unable to get user'})
                    });
            } else {
                res.status(400).json({
                    err: 'Username or Password dont match'
                });
            }
        });
    })
    .catch(err => {
        res.status(400).json({
            err: 'Cant find email',
        });
    });
}

module.exports = {
    handleSignin: handleSignin,
};