const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;
const { ObjectId } = require('mongodb');

// let validNames = (input) => {
//     //First take out any whitespace within word
//     //Then set word equal to a temp
//     //Strip away any non-alpha chars
//     //compare length
//     //myString.replace(/ /g,''); <-- strips all whitespace
//     let originalInput = input;
//     const alphabet = /[^A-Za-z]/g;
//     let alphaInput = input.replace(alphabet, "");
    
//     if(input.length !== alphaInput.length)
//         return false;

//     return true;
// };

let validWebsite = (website) => {
    let lowCaseWeb = website.toLowerCase();
    let begin1 = "http://www.";
    let begin2 = "https://www.";
    let ending = ".com";
    let a = lowCaseWeb.indexOf(begin1);
    let b = lowCaseWeb.indexOf(begin2);
    let c = lowCaseWeb.indexOf(ending);

    if((a > 0 || b > 0) || (a === -1 && b === -1))
        return false;

    if (c === -1)
        return false;
    
    if(b === 0) {
        let newString = lowCaseWeb.replace(begin2, "").replace(ending, "");
        if(newString.length < 5)
            return false;
    }

    if(a === 0) {
        let newString = lowCaseWeb.replace(begin1, "").replace(ending, "");
        if(newString.length < 5)
            return false;
    }
    
    return true;
};

let createMovie = async (movie_name, director, release_year, cast, streaming, genre, movie_img) => {
    if(!movie_name || !director || !release_year || !cast || !streaming || !genre || !movie_img) 
        throw 'One or more input parameter missing.';

    if(typeof movie_name !== 'string' || typeof director !== 'string') 
        throw 'Incorrect data types';
    
    if(movie_name.trim().length === 0 || director.trim().length === 0) 
        throw 'Strings are just empty spaces';
    
    //Most likely will need an extra check for director name
    //Make sure it is a valid name
    //Can not add the same movie twice

    if(typeof release_year !== 'number') 
        throw 'Incorrect data type';
    
    //First film produced was 1888
    if(release_year < 1888 || release_year > new Date().getFullYear())
        throw 'Invalid release year';

    if(!Array.isArray(cast) || !Array.isArray(genre)) 
        throw 'Incorrect data type';

    for(i = 0; i < cast.length; i++) {
        if(typeof cast[i] !== "string" || cast[i].trim().length === 0)
            throw "cast is not an array of strings or contains empty strings";
        cast[i] = cast[i].trim();
    }

    for(i = 0; i < genre.length; i++) {
        if(typeof genre[i] !== "string" || genre[i].trim().length === 0)
            throw "genre is not an array of strings or contains empty strings";
        genre[i] = genre[i].trim();
    }

    if(typeof streaming !== "object")
        throw "streaming is not an object";

    if(streaming === null || Array.isArray(streaming))
        throw "streaming in not a valid object";

    if(!("name" in streaming) || !("link" in streaming)) 
        throw "streaming missing important information";

    for(let option in streaming) {
        if(typeof streaming[option] !== "string" || streaming[option].trim().length === 0)
            throw "key/value pair in streaming is invalid";
    }

    if(!validWebsite(streaming["link"].trim()))
        throw "link field in streaming is not a valid website";
    
    //validating img here

    const movieCollection = await movies();

    //make a userId field FOR LATER
    let newMovie = {
        movie_name: movie_name.trim(),
        director: director.trim(),
        release_year: release_year,
        cast: cast,
        streaming_service: streaming,
        rating: 0,
        genre: genre,
        views: 0,
        reviews: [],
        watched_list: [],
        movie_img: movie_img,
        tag: "movie"
    };

    const insertMovie = await movieCollection.insertOne(newMovie);
    
    if(insertMovie.insertedCount === 0)
        throw "movie could not be added";
    
    return `${movie_name} successfully added!`;
};

let updateMovie = async (id, movie_name, director, release_year, cast, streaming, genre, movie_img) => {
    if(!id || !movie_name || !director || !release_year || !cast || !streaming || !genre || !movie_img)
        throw "One or more input parameter missing.";
    
    if(typeof id !== "string")
        throw "id is of invalid type";

    if(id.trim().length === 0)
        throw "id supplied is just an empty string";
    
    if(!ObjectId.isValid(id.trim()))
        throw "id is not a valid ObjectId";

    if(typeof movie_name !== 'string' || typeof director !== 'string') 
        throw 'Incorrect data types';
    
    if(movie_name.trim().length === 0 || director.trim().length === 0) 
        throw 'Strings are just empty spaces';
    
    //Most likely will need an extra check for director name
    //Make sure it is a valid name

    if(typeof release_year !== 'number') 
        throw 'Incorrect data type';
    
    //First film produced was 1888
    if(release_year < 1888 || release_year > new Date().getFullYear())
        throw 'Invalid release year';

    if(!Array.isArray(cast) || !Array.isArray(genre)) 
        throw 'Incorrect data type';

    for(i = 0; i < cast.length; i++) {
        if(typeof cast[i] !== "string" || cast[i].trim().length === 0)
            throw "cast is not an array of strings or contains empty strings";
        cast[i] = cast[i].trim();
    }

    for(i = 0; i < genre.length; i++) {
        if(typeof genre[i] !== "string" || genre[i].trim().length === 0)
            throw "genre is not an array of strings or contains empty strings";
        genre[i] = genre[i].trim();
    }

    if(typeof streaming !== "object")
        throw "streaming is not an object";

    if(streaming === null || Array.isArray(streaming))
        throw "streaming in not a valid object";

    if(!("name" in streaming) || !("link" in streaming)) 
        throw "streaming missing important information";

    for(let option in streaming) {
        if(typeof streaming[option] !== "string" || streaming[option].trim().length === 0)
            throw "key/value pair in streaming is invalid";
    }

    if(!validWebsite(streaming["link"].trim()))
        throw "link field in streaming is not a valid website";

    //validating img here

    let parseId = ObjectId(id.trim());
    let oldMovieName = "";
    let oldDirector = "";
    let oldYear = 0;
    let oldCast = [];
    let oldStream = {};
    let currRating = 0;
    let oldGenre = [];
    let currViews = 0;
    let currReviews = [];
    let currWatch = [];
    let oldImg = "";
    const movieCollection = await movies();

    try {
        const findMovie = await movieCollection.findOne({_id: parseId});
        if(findMovie === null)
            throw "no movie with given id";
        oldMovieName = findMovie.movie_name;
        oldDirector = findMovie.director;
        oldYear = findMovie.release_year;
        oldCast = findMovie.cast;
        oldStream = findMovie.streaming_service;
        currRating = findMovie.rating;
        oldGenre = findMovie.genre;
        currViews = findMovie.views;
        currReviews = findMovie.reviews;
        currWatch = findMovie.watched_list;
        oldImg = findMovie.movie_img;
    } catch(e) {
        throw "no movie with given id";
    }

    //Compare the mutable fields to see if at least ONE of them is different from previos version of the movie
    if(movie_name.trim() === oldMovieName && director.trim() === oldDirector && release_year === oldYear &&
        cast === oldCast && streaming === oldStream && genre === oldGenre && movie_img === oldImg)
            throw "updated fields are the same as the original";
    
    //make a userId field FOR LATER
    let updateMovie = {
        movie_name: movie_name.trim(),
        director: director.trim(),
        release_year: release_year,
        cast: cast,
        streaming_service: streaming,
        rating: currRating,
        genre: genre,
        views: currViews,
        reviews: currReviews,
        watched_list: currWatch,
        movie_img: movie_img,
        tag: "movie"
    };

    const updatedMovie = await movieCollection.updateOne(
        { _id: parseId },
        { $set: updateMovie }
    );
    
    if(updatedMovie.modifiedCount === 0)
        throw "nothing was updated";
    
    return `${movie_name} with id ${id} successfully updated!`;
};

let getMovie = async (id) => {
    if(!id)
        throw "no id is given.";
    
    if(typeof id !== "string")
        throw "id is of invalid type";

    if(id.trim().length === 0)
        throw "id supplied is just an empty string";
    
    if(!ObjectId.isValid(id.trim()))
        throw "id is not a valid ObjectId";

    let parseId = ObjectId(id.trim());
    const movieCollection = await movies();
    const wantedMovie = await movieCollection.findOne({_id: parseId});

    if(wantedMovie === null)
        throw "no movie with given id";

    return wantedMovie;
};

let getAllMovies = async() => {
    const movieCollection = await movies();
    const moviesArr = await movieCollection.find({}).toArray();
    return moviesArr;
};

module.exports = {
    createMovie,
    updateMovie,
    getMovie,
    getAllMovies
};