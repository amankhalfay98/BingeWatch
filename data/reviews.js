const mongoCollections = require("../config/mongoCollections");
const ObjectId = require("mongodb").ObjectId;
const reviews = mongoCollections.reviews;

// Add a new review in review collection
const create = async (
  user_id,
  username,
  movie_id,
  movie_name,
  review,
  rating,
  tag
) => {
  let newReview = {
    user_id,
    username,
    movie_id,
    movie_name,
    review,
    rating,
    tag,
  };
  const reviewsCollection = await reviews();
  const insertInfo = await reviewsCollection.insertOne(newReview);
  if (insertInfo.insertedCount === 0) throw "Could not add Review";
};

// To get all the reviews for a particular user using user_id
const getByUser = async (user_id) => {
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
const getByMovieId = async (movie_id) => {
  const reviewCollection = await reviews();
  const allReviews = await reviewCollection
    .find({ movie_id: { $eq: movie_id } })
    .toArray();
  for (let x of allReviews) {
    x._id = x._id.toString();
  }
  if (allReviews && allReviews.length > 0) {
    return allReviews;
  } else {
    return "Review Not Found";
  }
};

// To get single review using review id
const getById = async (id) => {
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
  if (review === undefined) throw "No id provided";
  if (rating === undefined) throw "No id provided";
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
  if (!id) throw "You must provide an id to search for";
  if (typeof id !== "string" || !ObjectId.isValid(id))
    throw "You must provide a valid id format";
  id = new ObjectId(id.trim());
  const reviewsCollection = await reviews();
  const deletionInfo = await reviewsCollection.deleteOne({ _id: id });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete review with id of ${id}`;
  } else {
    return { deleted: true };
  }
};

module.exports = {
  create,
  getByUser,
  getById,
  getByMovieId,
  update,
  remove,
};
