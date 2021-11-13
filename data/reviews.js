const mongoCollections = require("../config/mongoCollections");
const ObjectId = require("mongodb").ObjectId;
const reviews = mongoCollections.reviews;

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

const get = async (id) => {
  return 1;
};

const update = async (id, review, rating) => {
  return 1;
};

const remove = async (id) => {
  if (!id) throw "You must provide an id to search for";
  if (!ObjectId.isValid(id)) throw "You must provide a valid id format";
  id = convertStringToObject(id);
  const reviewsCollection = await reviews();
  const deletionInfo = await reviewsCollection.deleteOne({ _id: id });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete review with id of ${id}`;
  }
  const result = `Review has been deleted.`;
  return result;
};

module.exports = {
  create,
  get,
  update,
  remove,
};
