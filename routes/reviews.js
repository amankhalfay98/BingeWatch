const express = require("express");
const router = express.Router();
const data = require("../data");
const reviews = data.reviews;
const xss = require('xss');

//CHANGE: xss (still needs error check)
//WHY IS TAG BEING PASSED???????????
//REVIEW THIS ROUTE
router.post("/postReview", async (req, res) => {
  let data = req.body;
  const { username, movie_id, movie_name, review, rating, tag } = data;
  const postReview = await reviews.create(
    xss(username),
    xss(movie_id),
    xss(movie_name),
    xss(review),
    parseInt(xss(rating)),
    xss(tag)
  );
  //   console.log(postReview);
  res.json(postReview);
});

//CHANGE: xss and error check
router.post('/report', async function (req, res){
  let data = req.body;
  const { reviewId, username, movie_id } = data;
  const reported = await reviews.updateReviewReport(xss(reviewId), xss(username), xss(movie_id));
  res.json(reported);
})

//CHANGE: error check + xss
router.post("/:id", async (req, res) => {
  //let data = req.body;
  //const { movie_id } = data;
  //if(req.params.id){
  try {
    if(!req.params.id || typeof req.params.id !== "string")
      throw "invalid id passed";
    const allReviews = await reviews.getReviewsByMovieId(xss(req.params.id));
    res.json(allReviews);
  } catch(e) {
    res.status(404).json({error: e});
  }
  // if(!req.params.id || typeof req.params.id !== "string")
  //   throw "invalid id passed";
  // const allReviews = await reviews.getReviewsByMovieId(xss(req.params.id));
  // res.json(allReviews);
  //} catch (error) {}
  //}
});

//CHANGE: input check for id and throw string
router.delete("/deleteReview/:id", async (req, res) => {
  try {
    if(!req.params.id || typeof req.params.id !== "string")
      throw "invalid id passed";
    
    let data = req.params.id;
    const deleteReview = await reviews.remove(data);
    if (deleteReview.deleted) {
      res.json(deleteReview);
    }
  } catch (e) {
    res.status(404).json({error: e});
  }
});

module.exports = router;
