const mongoCollections = require("../config/mongoCollections");
const movies = mongoCollections.movies;
const { ObjectId } = require("mongodb");

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

  if (a > 0 || b > 0 || (a === -1 && b === -1)) return false;

  if (c === -1) return false;

  if (b === 0) {
    let newString = lowCaseWeb.replace(begin2, "").replace(ending, "");
    if (newString.length < 5) return false;
  }

  if (a === 0) {
    let newString = lowCaseWeb.replace(begin1, "").replace(ending, "");
    if (newString.length < 5) return false;
  }

  return true;
};

let createMovie = async (
  username,
  movie_name,
  director,
  release_year,
  cast,
  streaming,
  genre,
  movie_img
) => {
  if (
    !username ||
    !movie_name ||
    !director ||
    !release_year ||
    !cast ||
    !streaming ||
    !genre ||
    !movie_img
  )
    throw "One or more input parameter missing.";

  if (
    typeof username !== "string" ||
    typeof movie_name !== "string" ||
    typeof director !== "string"
  )
    throw "Incorrect data types";

  if (
    username.trim().length === 0 ||
    movie_name.trim().length === 0 ||
    director.trim().length === 0
  )
    throw "Strings are just empty spaces";

  //Most likely will need an extra check for director name
  //Make sure it is a valid name
  //Can not add the same movie twice

  if (typeof release_year !== "number" || !Number.isInteger(release_year))
    throw "Incorrect data type";

  //First film produced was 1888
  if (release_year < 1888 || release_year > new Date().getFullYear())
    throw "Invalid release year";

  if (!Array.isArray(cast) || !Array.isArray(genre))
    throw "Incorrect data type";

  //Loop within cast array to check name validity
  for (i = 0; i < cast.length; i++) {
    if (typeof cast[i] !== "string" || cast[i].trim().length === 0)
      throw "cast is not an array of strings or contains empty strings";
    cast[i] = cast[i].trim();
  }

  for (i = 0; i < genre.length; i++) {
    if (typeof genre[i] !== "string" || genre[i].trim().length === 0)
      throw "genre is not an array of strings or contains empty strings";
    genre[i] = genre[i].trim();
  }

  if (typeof streaming !== "object") throw "streaming is not an object";

  if (streaming === null || Array.isArray(streaming))
    throw "streaming in not a valid object";

  if (!("name" in streaming) || !("link" in streaming))
    throw "streaming missing important information";

  for (let option in streaming) {
    if (
      typeof streaming[option] !== "string" ||
      streaming[option].trim().length === 0
    )
      throw "key/value pair in streaming is invalid";
  }

  if (!validWebsite(streaming["link"].trim()))
    throw "link field in streaming is not a valid website";

  //validating img here

  const movieCollection = await movies();
  try {
    const findSameMovie = await movieCollection.findOne({
      movie_name: movie_name.trim(),
    });
    if (findSameMovie !== null) throw "movie already exists within database";
  } catch (e) {
    throw "movie already exists within database";
  }

  //username should be already populated when filling form
  let newMovie = {
    username: username.trim(),
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
    tag: "movie",
    reports: 0
  };

  const insertMovie = await movieCollection.insertOne(newMovie);

  if (insertMovie.insertedCount === 0) throw "movie could not be added";

  return `${movie_name} successfully added!`;
};

//username should not be editable
let updatingMovie = async (
  id,
  username,
  movie_name,
  director,
  release_year,
  cast,
  streaming,
  genre,
  movie_img
) => {
  if (
    !id ||
    !username ||
    !movie_name ||
    !director ||
    !release_year ||
    !cast ||
    !streaming ||
    !genre ||
    !movie_img
  )
    throw "One or more input parameter missing.";

  if (typeof id !== "string") throw "id is of invalid type";

  if (id.trim().length === 0) throw "id supplied is just an empty string";

  if (!ObjectId.isValid(id.trim())) throw "id is not a valid ObjectId";

  if (
    typeof username !== "string" ||
    typeof movie_name !== "string" ||
    typeof director !== "string"
  )
    throw "Incorrect data types";

  if (
    username.trim().length === 0 ||
    movie_name.trim().length === 0 ||
    director.trim().length === 0
  )
    throw "Strings are just empty spaces";

  //Most likely will need an extra check for director name
  //Make sure it is a valid name

  if (typeof release_year !== "number") throw "Incorrect data type";

  //First film produced was 1888
  if (release_year < 1888 || release_year > new Date().getFullYear())
    throw "Invalid release year";

  if (!Array.isArray(cast) || !Array.isArray(genre))
    throw "Incorrect data type";

  for (i = 0; i < cast.length; i++) {
    if (typeof cast[i] !== "string" || cast[i].trim().length === 0)
      throw "cast is not an array of strings or contains empty strings";
    cast[i] = cast[i].trim();
  }

  for (i = 0; i < genre.length; i++) {
    if (typeof genre[i] !== "string" || genre[i].trim().length === 0)
      throw "genre is not an array of strings or contains empty strings";
    genre[i] = genre[i].trim();
  }

  if (typeof streaming !== "object") throw "streaming is not an object";

  if (streaming === null || Array.isArray(streaming))
    throw "streaming in not a valid object";

  if (!("name" in streaming) || !("link" in streaming))
    throw "streaming missing important information";

  for (let option in streaming) {
    if (
      typeof streaming[option] !== "string" ||
      streaming[option].trim().length === 0
    )
      throw "key/value pair in streaming is invalid";
  }

  if (!validWebsite(streaming["link"].trim()))
    throw "link field in streaming is not a valid website";

  //validating img here

  const movieCollection = await movies();
  try {
    const findSameMovie = await movieCollection.findOne({
      movie_name: movie_name.trim(),
    });
    if (findSameMovie !== null) throw "movie already exists within database";
  } catch (e) {
    throw "movie already exists within database";
  }

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
  let currRep = 0;

  try {
    const findMovie = await movieCollection.findOne({ _id: parseId });
    if (findMovie === null) throw "no movie with given id";
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
    currRep = findMovie.reports;
  } catch (e) {
    throw "no movie with given id";
  }

  //Compare the mutable fields to see if at least ONE of them is different from previos version of the movie
  if (
    movie_name.trim() === oldMovieName &&
    director.trim() === oldDirector &&
    release_year === oldYear &&
    cast === oldCast &&
    streaming === oldStream &&
    genre === oldGenre &&
    movie_img === oldImg
  )
    throw "updated fields are the same as the original";

  let updateMovie = {
    username: username.trim(),
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
    tag: "movie",
    reports: currRep
  };

  const updatedMovie = await movieCollection.updateOne(
    { _id: parseId },
    { $set: updateMovie }
  );

  if (updatedMovie.modifiedCount === 0) throw "nothing was updated";

  return `${movie_name} with id ${id} successfully updated!`;
};

let getMovie = async (id) => {
  //console.log(id);
  if (!id) throw "no id is given.";

  if (typeof id !== "string") throw "id is of invalid type";

  if (id.trim().length === 0) throw "id supplied is just an empty string";

  if (!ObjectId.isValid(id.trim())) throw "id is not a valid ObjectId";

  let parseId = ObjectId(id.trim());
  const movieCollection = await movies();
  const wantedMovie = await movieCollection.findOne({ _id: parseId });

  if (wantedMovie === null) throw "no movie with given id";

  //console.log(wantedMovie);

  return wantedMovie;
};

let getAllMovies = async () => {
  const movieCollection = await movies();
  const moviesArr = await movieCollection
    .find({})
    .sort({ movie_name: 1 })
    .toArray();
  return moviesArr;
};

// A method to add review id to movies collection when new review is added.
let updateMovieReviewID = async (movie_id, review_id, review_rating) => {
  if (!ObjectId.isValid(movie_id.trim())) throw "Movie id is not a valid ObjectId";

  let parseId = ObjectId(movie_id.trim());
  const movieCollection = await movies();
  let movie = await movieCollection.findOne({ _id: parseId });
  movie.reviews.push(review_id.toString());
  movie.rating = review_rating;
  const updatedMovie = await movieCollection.updateOne(
    { _id: parseId },
    { $set: movie }
  );
  if (updatedMovie.modifiedCount === 0) throw "nothing was updated";

  return `${movie.movie_name} with id ${movie._id} successfully updated!`;
};

let getTrending = async () => {
  const movieCollection = await movies();
  const moviesArr = await movieCollection
    .find({})
    .sort({ views: -1 })
    .limit(4)
    .toArray();
  return moviesArr;
};

let getSort = async (value)=> {
  const movieCollection = await movies();
  if (value === "watchCount") {
    const moviesArr = await movieCollection
      .find({})
      .sort({ views: -1 })
      .toArray();
    return moviesArr;
  } else if (value === "rating") {
    const moviesArr = await movieCollection
      .find({})
      .sort({ rating: -1 })
      .toArray();
    return moviesArr;
  }
  else if(value ==='alphabetically'){
    const moviesArr = await movieCollection.find({}).sort({movie_name:1}).toArray();
    return moviesArr;
  }
};

let movieWatched = async (user, movie) => {
  if (!user || !movie) throw "missing input parameters";

  if (typeof user !== "string" || typeof movie !== "string")
    throw "invalid data type";

  if (user.trim().length === 0 || movie.trim().length === 0)
    throw "invalid strings";

  const moviesCollection = await movies();
  let currMovie = await moviesCollection.findOne({ movie_name: movie.trim() });
  if (currMovie === null) throw "movie not found";

  const updatedMovie = await moviesCollection.updateOne(
    { movie_name: movie.trim() },
    { $push: { watched_list: user.trim() }, $inc: { views: 1 } }
  );

  if (updatedMovie.modifiedCount === 0) {
    throw "nothing was added into favourites";
  }

  return `${movie} successfully marked as watched.`;
};

let searchByMovie = async (movie) => {
  if (!movie) throw "missing input parameters";

  if (typeof movie !== "string")
    throw "invalid data type";

  if (movie.trim().length === 0)
    throw "invalid strings";

  let regExTerm = new RegExp(".*" + movie.trim() + ".*", "i");
  const moviesCollection = await movies();
  let matched = await moviesCollection.find({ movie_name: regExTerm }).toArray();
  if (matched.length === 0) throw `no movies matched to ${movie.trim()}.`;

  return matched;
};

let searchByDirector = async (director) => {
  if (!director) throw "missing input parameters";

  if (typeof director !== "string")
    throw "invalid data type";

  if (director.trim().length === 0)
    throw "invalid strings";

  let regExTerm = new RegExp(".*" + director.trim() + ".*", "i");
  const moviesCollection = await movies();
  let matched = await moviesCollection.find({ director: regExTerm }).toArray();
  if (matched.length === 0) throw `no movies matched to ${director.trim()}.`;

  return matched;
};

let searchByCast = async (name) => {
  if (!name) throw "missing input parameters";

  if (typeof name !== "string")
    throw "invalid data type";

  if (name.trim().length === 0)
    throw "invalid strings";

  let regExTerm = new RegExp(".*" + name.trim() + ".*", "i");
  const moviesCollection = await movies();
  let matched = await moviesCollection.find({ cast: { $in: [regExTerm] } }).toArray();
  if (matched.length === 0) throw `no movies matched to ${director.trim()}.`;

  return matched;
};

//FUNCTION FOR REPORTING AND AUTOMATIC REMOVAL OF MOVIES (EXTRA)
let reportMovie = async (movie) => {
  //TODO
};

module.exports = {
	createMovie,
	updatingMovie,
	getMovie,
	getAllMovies,
	getTrending,
	updateMovieReviewID,
	getSort,
  movieWatched,
  searchByMovie,
  searchByDirector,
  searchByCast,
  reportMovie
};
