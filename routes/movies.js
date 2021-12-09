const express = require("express");
const router = express.Router();
const data = require("../data");
const moviesData = data.movies;
const validation = require("../data/validation");

router.get("/all", async (req, res) => {
  try {
    const listRest = await moviesData.getAllMovies();
    res.render("movies/allMovies", {
      movieList: listRest,
      title: "Characters Found",
    });
  } catch (e) {
    res.status(400).render("pages/error", { error: e, title: "Search Error" });
  }
});

// router.post('/all/:genre', async (req, res) => {
//   try {
//     const sorted = await moviesData.getByGenre(req.params.genre);
//     res.json(sorted)
//   } catch (e) {
//   }
// });

// router.post('/all/:year', async (req, res) => {
//   try {
//     const sorted = await moviesData.getReleaseYear(req.params.year);
//     res.json(sorted)
//   } catch (e) {
//   }
// });

// router.post('/all/:service', async (req, res) => {
//   try {
//     const sorted = await moviesData.getStreamingervice(req.params.service);
//     res.json(sorted)
//   } catch (e) {
//   }
// });

// router.post('/all/:rate', async (req, res) => {
//   try {
//     const sorted = await moviesData.getRating(req.params.rate);
//     res.json(sorted)
//   } catch (e) {
//   }
// });

router.post("/all/:value", async (req, res) => {
  try {
    const sorted = await moviesData.getSort(req.params.value);
    res.json(sorted);
  } catch (e) {}
});

router.get("/addMovie", async (req, res) => {
  try {
    res.render("movies/newMovie", { title: "Characters Found" });
  } catch (e) {
    res.status(400).render("pages/error", { error: e, title: "Search Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await moviesData.getMovie(req.params.id);
    //console.log(movie);
    res.render("movies/individualMovie", {
      movie: movie,
      title: "Characters Found",
    });
  } catch (e) {
    res.status(400).render("pages/error", { error: e, title: "Search Error" });
  }
});

//WIP!!!!!
router.get("/", async (req, res) => {
  try {
    const listRest = await moviesData.getTrending();
    res.status(200).json(listRest);
  } catch (e) {
    res.status(400).render("pages/error", { error: e, title: "Search Error" });
  }
});

router.post("/addMovie", async (req, res) => {
  const moviesDataList = req.body;
  if (
    moviesDataList &&
    moviesDataList.stream_service &&
    moviesDataList.stream_service_url
  ) {
    moviesDataList.streaming_services = {
      name: moviesDataList.stream_service,
      link: moviesDataList.stream_service_url,
    };
  }
  if (!moviesDataList.movie_name) {
    res.status(400).json({ error: "You must provide Name of the Movie" });
    return;
  }
  if (!moviesDataList.director) {
    res
      .status(400)
      .json({ error: "You must provide the director name of the Movie" });
    return;
  }
  if (!moviesDataList.release_year) {
    res
      .status(400)
      .json({ error: "You must provide release year of the Movie" });
    return;
  }
  if (!moviesDataList.cast) {
    res.status(400).json({ error: "You must provide cast of the Movie" });
    return;
  }
  if (!moviesDataList.genre) {
    res.status(400).json({ error: "You must provide genre of the Movie" });
    return;
  }
  if (!moviesDataList.streaming_services) {
    res
      .status(400)
      .json({ error: "You must provide streaming services of the Movie" });
    return;
  }
  if (!moviesDataList.movie_img) {
    res
      .status(400)
      .json({ error: "You must provide poster/image of the Movie" });
    return;
  }
  if (moviesDataList && moviesDataList.cast) {
    moviesDataList.cast = moviesDataList.cast.split("\r\n");
  }
  if (moviesDataList && moviesDataList.genre) {
    moviesDataList.genre = moviesDataList.genre.split();
  }
  moviesDataList.release_year = parseInt(moviesDataList.release_year);

  try {
    const {
      movie_name,
      director,
      release_year,
      cast,
      streaming_services,
      genre,
      movie_img,
    } = moviesDataList;
    const newMovie = await moviesData.createMovie(
      movie_name,
      director,
      release_year,
      cast,
      streaming_services,
      genre,
      movie_img
    );
    res.status(200).json(newMovie);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.put("/edit/:id", async (req, res) => {
  const updatedData = req.body;
  if (
    !updatedData.movie_name ||
    !updatedData.director ||
    !updatedData.release_year ||
    !updatedData.cast ||
    !updatedData.genre ||
    !updatedData.streaming_services
  ) {
    res.status(400).json({ error: "You must Supply All fields" });
    return;
  }
  try {
    await moviesData.getMovie(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Movie/TV Show not found" });
    return;
  }

  try {
    const {
      movie_name,
      director,
      release_year,
      cast,
      streaming_services,
      genre,
      movie_img,
    } = updatedData;
    const updatedMovie = await moviesData.updatingMovie(
      req.params.id,
      movie_name,
      director,
      release_year,
      cast,
      streaming_services,
      genre,
      movie_img
    );
    res.status(200).json(updatedMovie);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

// router.delete('/:id', async (req, res) => {
//     if (!req.params.id) {
//       res.status(400).json({ error: 'You must Supply an ID to delete' });
//       return;
//     }
//     try {
//       await moviesData.get(req.params.id);
//     } catch (e) {
//       res.status(404).json({ error: 'Movie not found' });
//       return;
//     }
//     try {
//       const delmovie = await moviesData.remove(req.params.id);
//       res.status(200).json(delmovie);
//     } catch (e) {
//       res.status(500).json({ error: e });
//     }
//   });

module.exports = router;
