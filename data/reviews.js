const mongoCollections = require("../config/mongoCollections");
const ObjectId = require("mongodb").ObjectId;
const reviews = mongoCollections.reviews;
const moviesData = require('./movies');
const validation = require("./validation");

// Add a new review in review collection
const create = async (
  username,
  movie_id,
  movie_name,
  review,
  rating
) => {
  if (!validation.validString(username))
    throw "username provided is not a valid string.";
  if (!validation.validObjectIdString(movie_id))
    throw "movie id provided is not a valid object.";
  if (!validation.validString(movie_name))
    throw "movie name provided is not a valid string.";
  if (!validation.validString(review))
    throw "review provided is not a valid string.";
  if (!validation.validRating(rating))
    throw "rating provided is not a valid string.";
  let newReview = {
    username,
    movie_id,
    movie_name,
    review,
    rating,
    tag: "review",
    reported:[]
  };
  const reviewsCollection = await reviews();
  const insertInfo = await reviewsCollection.insertOne(newReview);
  if (insertInfo.insertedCount === 0) throw "Could not add Review";
  let reviewArray = await getReviewsByMovieId(movie_id);
  if(reviewArray.length>0){
    let overAllRating = 0;
    reviewArray.forEach(element => {
      overAllRating += element.rating;
    }); 
    overAllRating = Math.round(overAllRating/reviewArray.length);
    await moviesData.updateMovieReviewID(movie_id,insertInfo.insertedId,overAllRating);
  }
  else{
    let overAllRating = rating;
    await moviesData.updateMovieReviewID(movie_id,insertInfo.insertedId,overAllRating);
  }
  //const reviewAdded = getById(insertInfo.insertedId.toString());
  //return reviewAdded;
  return `${review} successfully added!`;
};

// To get all the reviews for a particular user using user_id
const getByUser = async (user_id) => {
  if (!validation.validObjectIdString(user_id))
    throw "user id provided is not a valid object.";
  const reviewCollection = await reviews();
  const allReviews = await reviewCollection
    .find({ user_id: { $eq: user_id } })
    .toArray();
  for (let x of allReviews) {
    x._id = x._id.toString();
  }
  return allReviews;
};

// To get all the reviews for a particular movie using movie id
const getReviewsByMovieId = async (movie_id) => {
  if (!validation.validObjectIdString(movie_id))
    throw "movie id provided is not a valid object.";
  const reviewCollection = await reviews();
  const allReviews = await reviewCollection
    .find({ movie_id: { $eq: movie_id } })
    .toArray();
  for (let x of allReviews) {
    x._id = x._id.toString();
  }
  if (allReviews && allReviews.length > 0) {
    // reviewArray =[]
    // //console.log(Array.isArray(allReviews));
    // for(let i = allReviews.length-1;i>=0;i--){
    // reviewArray.push(allReviews[i]);
    // }
    return allReviews;
  } else {
    return [];
  }
};

// To get single review using review id
const getById = async (id) => {
  if (!validation.validObjectIdString(id))
    throw "user id provided is not a valid object.";
  let reviewId = ObjectId(id);
  const reviewCollection = await reviews();
  let review = await reviewCollection.findOne({ _id: reviewId });
  if (review === null) throw "No review with that id.";
  review._id = review._id.toString();
  return review;
};

// Method to update review and rating
const update = async (id, review, rating) => {
  if (id === undefined) throw "No id provided";
  if (!validation.validObjectIdString(id))
    throw "user id provided is not a valid object.";
  if (review === undefined) throw "No id provided";
  if (!validation.validString(review))
    throw "review provided is not a valid string.";
  if (rating === undefined) throw "No id provided";
  if (!validation.validRating(rating))
    throw "review provided is not a valid string.";
  const reviewCollection = await reviews();
  let reviewId = ObjectId(id);
  let originalData = await get(reviewId);
  if (Object.keys(originalData).length === 0) {
    throw `No Review found with this id.`;
  }
  let updatedReview = await reviewCollection.updateOne(
    { _id: reviewId },
    {
      $set: {
        user_id: originalData.user_id,
        username: originalData.username,
        movie_id: originalData.movie_id,
        movie_name: originalData.movie_name,
        review: review,
        rating: rating,
        tag: originalData.tag,
      },
    }
  );
  if (updatedReview.matchedCount === 1 && updatedReview.modifiedCount === 0) {
    throw `There is no change in review with id of ${id}`;
  }
  if (updatedReview.modifiedCount === 0) {
    throw `Could not update review with id of ${id}`;
  }
  const finalReview = await getById(id);
  return finalReview;
};

// Method to remove review using review id
const remove = async (id) => {
  if (id === undefined) throw "No id provided";
  if (!validation.validObjectIdString(id))
    throw "user id provided is not a valid object.";
  id = new ObjectId(id.trim());
  const reviewsCollection = await reviews();
  const deletionInfo = await reviewsCollection.deleteOne({ _id: id });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete review with id of ${id}`;
  } else {
    return { deleted: true };
  }
};

const updateReviewReport = async (reviewId, username) => {
  if (!validation.validString(reviewId)) throw 'Review id is not a valid string.';
  //if (!validation.validString(userId)) throw 'User id is not a valid string.';
  
  const objReviewId = ObjectId(reviewId);
  //const uid = ObjectId(userId)

  const reviewCollection = await reviews();
  let review = await reviewCollection.findOne({ _id: objReviewId });
  if (review === null) throw 'No review with that id.';
  
  //const myRev = await this.getById(reviewId);
  //if(myRev === null) throw 'No review with that id.';

  //if (myRev.reported.includes(userId)){
    //if(checked){
      const updateInfo = await reviewCollection.updateOne({_id: objReviewId},{$addToSet: {reported: username}});
      if (!updateInfo.matchedCount && !updateInfo.modifiedCount) return false;
      // const updateInfo = await reviewCollection.updateOne({_id: objReviewId},{$pull: {reported: userId}});
      // if (!updateInfo.matchedCount && !updateInfo.modifiedCount) return false;
   // }
  //}
  // else{
  //     const updateInfo = await reviewCollection.updateOne({_id: objReviewId},{$pull: {reported: username}});
  //     if (!updateInfo.matchedCount && !updateInfo.modifiedCount) return false;
  //     // const updateInfo = await reviewCollection.updateOne({_id: objReviewId},{$addToSet: {reported: userId}});
  //     // if (!updateInfo.matchedCount && !updateInfo.modifiedCount) return false;
  // }
  const myRevUpdated = await getById(reviewId);
  if (myRevUpdated.reported.length == 5){
      await this.remove(reviewId);
      return true;
  }
  return false;
};

module.exports = {
  create,
  getByUser,
  getById,
  getReviewsByMovieId,
  update,
  remove,
  updateReviewReport
};
