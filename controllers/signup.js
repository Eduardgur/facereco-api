const handleSignup = (db, bcrypt) => (req, res) => {
    let { email, name, password } = req.body;
    if (name === '') {
        name = null;
    }
    if (email === '') {
        email = null;
    }
    if (password === ''){
        dbError(res, {code: '23502'});
        return;
    }
    bcrypt.hash(password, null, null, (err, hash) => {
        db.transaction(trx => {
            trx.insert({
                email: email,
                hash: hash,
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                trx('users')
                .returning('*')
                .insert({
                    email: email,
                    name: name,
                    join_date: new Date(),
                })
                .then(user => {
                    res.json({
                        user: user[0],
                        response: 'Account has been created seccessfuly',
                    });
                })
                .then(trx.commit)
                .catch(error => {
                    dbError(res, error);
                    trx.rollback;
                });
            })
            .catch(error => {
                dbError(res, error);
                trx.rollback;
            });
        });
        
    })
}

dbError = (res, error) => {
    console.log(error.code);
    
    switch (error.code) {
        case '23514' :
            return res.status(400).json({
                err: 'Incorrect email format.'
            })
            break;
        case '23505':
            return res.status(400).json({
                err: 'Email already exists.'
            });
            break;
        case '23502' :
            return res.status(400).json({
                err: 'Fields cant be empty.'
            });
            break;
        default :
            console.log(error);        
            return res.status(400).json({
                err: `Error: ${error}`
            });
            break;
    }
}

module.exports = {
    handleSignup : handleSignup,
};