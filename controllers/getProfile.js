const handleGetProfile = (db) => (req, res) => {
    const { id } = req.params;
    db('users')
        .select('*')
        .where({id: id})
        .then(user => {
            if (user.length) {
                res.json({
                    user: user[0],
                });
            } else {
                res.status(400).json('User not found')
            }
        }).catch(err => res.status(400).json('Error getting user'))
}

module.exports = {
    handleGetProfile: handleGetProfile,
}