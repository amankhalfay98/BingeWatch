const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;

let create = async (movie_name, director, release_year, cast, streaming, genre, movie_img) => {
    if(!movie_name || !director || !release_year || !cast || !streaming || !genre || !movie_img) {
        throw 'One or more input parameter missing.';
    }

    if(typeof movie_name !== 'string' || typeof director !== 'string') {
        throw 'Incorrect data types';
    }

    if(typeof release_year !== 'number') {
        throw 'Incorrect data type';
    }

    if(!Array.isArray(cast) || !Array.isArray(genre)) {
        throw 'Incorrect data type';
    }

    //Do error check for obj and img


};

let update = async () => {
    return 1; 
};

let remove = async () => {
    return 1; 
};

module.exports = {
    create,
    update,
    remove
};