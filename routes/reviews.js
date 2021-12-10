const express = require("express");
const router = express.Router();
const data = require("../data");
const reviews = data.reviews;

router.get("/", async (req, res) => {
  res.render('pages/landing')
});

router.post("/:id", async (req, res) => {
  //let data = req.body;
  //const { movie_id } = data;
  //if(req.params.id){
  try {
    const allReviews = await reviews.getReviewsByMovieId(req.params.id);
    res.json(allReviews);
  } catch (error) {}
  //}
});
router.post("/postReview", async (req, res) => {
  try {
    let data = req.body;
    const { user_id, username, movie_id, movie_name, review, rating, tag } =
      data;
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
  } catch (error) {}
  res.json(postReview);
});
router.delete("/deleteReview/:id", async (req, res) => {
  try {
    let data = req.params.id;
    const deleteReview = await reviews.remove(data);
    if (deleteReview.deleted) {
      res.json(deleteReview);
    }
  } catch (error) {}
});

module.exports = router;
