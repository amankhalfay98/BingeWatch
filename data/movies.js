const mongoCollections = require("../config/mongoCollections");
const movies = mongoCollections.movies;
//const reviewCollection = require('./reviews');
const { ObjectId } = require("mongodb");
const validate = require('./validation');
const users = require('./users');

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
    typeof director !== "string" ||
    typeof genre !== "string"
  )
    throw "Incorrect data types";

  if (
    username.trim().length === 0 ||
    movie_name.trim().length === 0 ||
    director.trim().length === 0 ||
    genre.trim().length === 0
  )
    throw "Strings are just empty spaces";

  if(!validate.validName(director))
    throw "Invalid director name";

  if (typeof release_year !== "number" || !Number.isInteger(release_year))
    throw "Incorrect data type";

  //First film produced was 1888
  if (release_year < 1888 || release_year > new Date().getFullYear())
    throw "Invalid release year";

  if (!Array.isArray(cast))
    throw "Incorrect data type";

  //Loop within cast array to check name validity
  for (i = 0; i < cast.length; i++) {
    if (typeof cast[i] !== "string" || cast[i].trim().length === 0 || !validate.validName(cast[i]))
      throw "cast is not an array of strings or contains empty strings";
    cast[i] = cast[i].trim();
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

  let newMovie = {
    username: username.trim(),
    movie_name: movie_name.trim(),
    director: director.trim(),
    release_year: release_year,
    cast: cast,
    streaming_service: streaming,
    rating: 0,
    genre: genre.trim(),
    views: 0,
    reviews: [],
    watched_list: [],
    movie_img: movie_img,
    tag: "movie",
    favourite_list:[],
    toWatch_list:[],
    reported:[]
  };

  const insertMovie = await movieCollection.insertOne(newMovie);

  if (insertMovie.insertedCount === 0) throw "movie could not be added";
  const addedMovie = getMovie(insertMovie.insertedId.toString());
  return addedMovie;
  //return `${movie_name} successfully added!`;
};

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
    typeof director !== "string" ||
    typeof genre !== "string"
  )
    throw "Incorrect data types";

  if (
    username.trim().length === 0 ||
    movie_name.trim().length === 0 ||
    director.trim().length === 0 ||
    genre.trim().length === 0
  )
    throw "Strings are just empty spaces";

  if(!validate.validName(director))
    throw "Invalid director name";

  if (typeof release_year !== "number" || !Number.isInteger(release_year))
    throw "Incorrect data type";

  //First film produced was 1888
  if (release_year < 1888 || release_year > new Date().getFullYear())
    throw "Invalid release year";

  if (!Array.isArray(cast))
    throw "Incorrect data type";

  //Loop within cast array to check name validity
  for (i = 0; i < cast.length; i++) {
    if (typeof cast[i] !== "string" || cast[i].trim().length === 0 || !validate.validName(cast[i]))
      throw "cast is not an array of strings or contains empty strings";
    cast[i] = cast[i].trim();
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
  let oldGenre = "";
  let currViews = 0;
  let currReviews = [];
  let currWatch = [];
  let oldImg = "";

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
    genre: genre.trim(),
    views: currViews,
    reviews: currReviews,
    watched_list: currWatch,
    movie_img: movie_img,
    tag: "movie",
  };

  const updatedMovie = await movieCollection.updateOne(
    { _id: parseId },
    { $set: updateMovie }
  );

  if (updatedMovie.modifiedCount === 0) throw "nothing was updated";

  return `${movie_name} with id ${id} successfully updated!`;
};

let getMovie = async (id) => {
  if (!id) throw "no id is given.";

  if (typeof id !== "string") throw "id is of invalid type";

  if (id.trim().length === 0) throw "id supplied is just an empty string";

  if (!ObjectId.isValid(id.trim())) throw "id is not a valid ObjectId";

  let parseId = ObjectId(id.trim());
  const movieCollection = await movies();
  const wantedMovie = await movieCollection.findOne({ _id: parseId });

  if (wantedMovie === null) throw "no movie with given id";

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
  if(movie.rating !== review_rating){
  movie.rating = review_rating;
  const updatedMovie = await movieCollection.updateOne(
    { _id: parseId },
    { $set: movie }
  );
  if (updatedMovie.modifiedCount === 0) throw "nothing was updated";
  }
  return `${movie.movie_name} with id ${movie._id} successfully updated!`;
};

let updateMovieRating = async (movie_id,rating)=>{
  if (!ObjectId.isValid(movie_id.trim())) throw "Movie id is not a valid ObjectId";

  let parseId = ObjectId(movie_id.trim());
  const movieCollection = await movies();
  let movie = await movieCollection.findOne({ _id: parseId });
  //movie.reviews.push(review_id.toString());
  if(movie.rating !== rating){
  movie.rating = rating;
  const updatedMovie = await movieCollection.updateOne(
    { _id: parseId },
    { $set: movie }
  );
  if (updatedMovie.modifiedCount === 0){ throw "nothing was updated";}
}

  return `${movie.movie_name} with id ${movie._id} successfully updated!`;
}

let getTrending = async () => {
  const movieCollection = await movies();
  const moviesArr = await movieCollection
    .find({})
    .sort({ views: -1 })
    .limit(4)
    .toArray();
  return moviesArr;
};

//error check needed
let getSort = async (value)=> {
  if(!value)
    throw "missing input parameter";
  
  if(typeof value !== "string" || value.trim().length === 0)
    throw "invalid input";
  
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

  return true;
};

let favMovies = async (user, movie) => {
  if (!user || !movie) throw "missing input parameters";

  if (typeof user !== "string" || typeof movie !== "string")
    throw "invalid data type";

  if (user.trim().length === 0 || movie.trim().length === 0)
    throw "invalid strings";

  const moviesCollection = await movies();
  let currMovie = await moviesCollection.findOne({ movie_name: movie.trim() });
  if (currMovie === null) throw "movie not found";

  let fav = false
  if (currMovie.favourite_list.includes(user)){
    const updatedUser = await moviesCollection.updateOne({ movie_name: movie.trim() },{$pull: { favourite_list: user.trim() }});
    if (updatedUser.matchedCount && updatedUser.modifiedCount) {fav = false};
  }
  else{
    const updatedUser = await moviesCollection.updateOne(
      { movie_name: movie.trim() },
      { $addToSet: { favourite_list: user.trim() } }
    );
    if (updatedUser.matchedCount && updatedUser.modifiedCount) {fav = true};
  }
  return fav;
};

let toWatchMovies = async (user, movie) => {
  if (!user || !movie) throw "missing input parameters";

  if (typeof user !== "string" || typeof movie !== "string")
    throw "invalid data type";

  if (user.trim().length === 0 || movie.trim().length === 0)
    throw "invalid strings";

  const moviesCollection = await movies();
  let currMovie = await moviesCollection.findOne({ movie_name: movie.trim() });
  if (currMovie === null) throw "movie not found";
  let watch = false
  if (currMovie.toWatch_list.includes(user)){
    const updatedUser = await moviesCollection.updateOne({ movie_name: movie.trim() },{$pull: { toWatch_list: user.trim() }});
    if (updatedUser.matchedCount && updatedUser.modifiedCount) {watch = false};
  }
  else{
    const updatedUser = await moviesCollection.updateOne(
      { movie_name: movie.trim() },
      { $addToSet: { toWatch_list: user.trim() } }
    );
    if (updatedUser.matchedCount && updatedUser.modifiedCount) {watch = true};
  }
  return watch;
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

const updateMovieReport = async (movieId, username) => {
  // ------------------- ERROR CHANGES ----------------------
  if(!movieId || !username)
    throw "no movieId was supplied";
    
  if(typeof movieId !== "string" || typeof username !== "string")
    throw "movieId is of invalid type";

  if(movieId.trim().length === 0 || username.trim().length === 0)
    throw "movieId supplied is just an empty string";
      
  if(!ObjectId.isValid(id.trim()))
    throw "movieId is not a valid ObjectId";

  let findUser = await users.getUser(username);

  if(findUser === null)
    throw "username not in database"; 
  
  // ----------------------------DELETE IF IT BREAKS APP -----------------------

  //if (!validation.validString(movieId)) throw 'Review id is not a valid string.';
  //if (!validation.validString(userId)) throw 'User id is not a valid string.';
  
  const objMovieId = ObjectId(movieId.trim());
  //const uid = ObjectId(userId)

  const moviesCollection = await movies();
  let movie = await moviesCollection.findOne({ _id: objMovieId });
  if (movie === null) throw 'No movie with that id.';
  
      const updateInfo = await moviesCollection.updateOne({_id: objMovieId},{$addToSet: {reported: username}});
      if (!updateInfo.matchedCount && !updateInfo.modifiedCount) return false;

  const myMovieUpdated = await getMovie(movieId);
  if (myMovieUpdated.reported.length == 5){
      await deleteMovie(movieId);
      return true;
  }
  return false;
};

let deleteMovie = async (id) => {
  if(!id)
    throw "no id was supplied";
    
  if(typeof id !== "string")
    throw "id is of invalid type";

  if(id.trim().length === 0)
    throw "id supplied is just an empty string";
    
  if(!ObjectId.isValid(id.trim()))
    throw "id is not a valid ObjectId";
  //if (!validation.validObjectIdString(id))
    //throw "movie id provided is not a valid object.";
  let parseId = new ObjectId(id.trim());

  const moviesCollection = await movies();
  const deletionInfo = await moviesCollection.deleteOne({ _id: parseId });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete movie with id of ${id}`;
  } else {
    return { deleted: true };
  }
//}
};

//set the view count to Math.random for trending page
let seedCreate = async (
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
    typeof director !== "string" ||
    typeof genre !== "string"
  )
    throw "Incorrect data types";

  if (
    username.trim().length === 0 ||
    movie_name.trim().length === 0 ||
    director.trim().length === 0 ||
    genre.trim().length === 0
  )
    throw "Strings are just empty spaces";

    if(!validate.validName(director))
    throw "Invalid director name";

  if (typeof release_year !== "number" || !Number.isInteger(release_year))
    throw "Incorrect data type";

  //First film produced was 1888
  if (release_year < 1888 || release_year > new Date().getFullYear())
    throw "Invalid release year";

  if (!Array.isArray(cast))
    throw "Incorrect data type";

  //Loop within cast array to check name validity
  for (i = 0; i < cast.length; i++) {
    if (typeof cast[i] !== "string" || cast[i].trim().length === 0 || !validate.validName(cast[i]))
      throw "cast is not an array of strings or contains empty strings";
    cast[i] = cast[i].trim();
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
    views: Math.floor(Math.random() * (500 - 0 + 1) + 0),
    reviews: [],
    watched_list: [],
    movie_img: movie_img,
    tag: "movie",
    favourite_list:[],
    toWatch_list:[]
  };

  const insertMovie = await movieCollection.insertOne(newMovie);

  if (insertMovie.insertedCount === 0) throw "movie could not be added";

  return newMovie;
  // return `${movie_name} successfully added!`;
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
  favMovies,
  toWatchMovies,
  searchByMovie,
  searchByDirector,
  searchByCast,
  updateMovieReport,
  deleteMovie,
  seedCreate,
  updateMovieRating
};
