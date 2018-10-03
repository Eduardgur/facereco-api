const clarifaiApi = require('clarifai');
const clarifai = new clarifaiApi.App({apiKey: 'f3b8b2a3fc9e4d93b266487e315bf64f'});

const handleGetFaces = (db) => (req, res) => {
    const { id, imageUrl } = req.body;
    console.log(req.body);
    
    clarifai.models.predict('a403429f2ddf4b49b307e318f00e528b', imageUrl)
    .then(response => {
        db('users')
        .returning('enteries')
        .where('id', '=', id)
        .increment('enteries', 1)
        .then(ent => {
            res.json({
                enteries: ent[0],
                faces: response,
            });
        })
        .catch(err => res.status(400).json("Cant get enteries"));
    })
    .catch(err => console.error('clarifai: ', err));
}




module.exports = {
    handleGetFaces: handleGetFaces,
};