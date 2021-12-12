const express = require("express");
const router = express.Router();
const data = require("../data");
const reviews = data.reviews;

router.post("/postReview", async (req, res) => {
  let data = req.body;
  const { username, movie_id, movie_name, review, rating, tag } = data;
  const postReview = await reviews.create(
    username,
    movie_id,
    movie_name,
    review,
    parseInt(rating),
    tag
  );
  //   console.log(postReview);
  res.json(postReview);
});

router.post('/report', async function (req, res){
  let data = req.body;
  const { reviewId, username,movie_id } = data;
  const reported = await reviews.updateReviewReport(reviewId,username,movie_id);
  //const rating = await reviews.getReviewsByMovieId

  res.json(reported);
})

router.post("/:id", async (req, res) => {
  //let data = req.body;
  //const { movie_id } = data;
  //if(req.params.id){
  const allReviews = await reviews.getReviewsByMovieId(req.params.id);
  res.json(allReviews);
  //} catch (error) {}
  //}
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
