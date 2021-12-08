const express = require("express");
const router = express.Router();
const data = require("../data");
const reviews = data.reviews;

router.post("/:id", async (req, res) => {
  //let data = req.body;
  //const { movie_id } = data;
  const allReviews = await reviews.getReviewsByMovieId(req.params.id);
  res.json(allReviews);
});
router.post("/postReview", async (req, res) => {
  let data = req.body;
  const { user_id, username, movie_id, movie_name, review, rating, tag } = data;
  const postReview = await reviews.create(
    user_id,
    username,
    movie_id,
    movie_name,
    review,
    rating,
    tag
  );
  //   console.log(postReview);
  res.json(postReview);
});
router.delete("/deleteReview/:id", async (req, res) => {
  let data = req.params.id;
  const deleteReview = await reviews.remove(data);
  if (deleteReview.deleted) {
    res.json(deleteReview);
  }
});

module.exports = router;
