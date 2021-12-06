const express = require("express");
const router = express.Router();
const data = require("../data");
const moviesData = data.movies;

router.get('movies/:id', async (req, res) => {
    try {
      const movie = await moviesData.getMovie(req.params.id);
      res.render('movies/individualMovie',{searchedChar:searchedChar, header:searchChar.searchTerm, title:'Characters Found'});
    } catch (e) {
      res.status(400).render('characters/retResponse',{error:e, title:'Search Error'});
    }
    //   res.status(200).json(movie);
    // } catch (e) {
    //   res.status(404).json({error : 'Movie/TV Show not found.'});
    // }
  });

  router.get('movies/all', async (req, res) => {
    try {
      const listRest = await moviesData.getAllMovies();
      res.render('movies/allMovies',{searchedChar:searchedChar, header:searchChar.searchTerm, title:'Characters Found'});
    } catch (e) {
      res.status(400).render('pages/error',{error:e, title:'Search Error'});
    }
    //   res.status(200).json(listRest);
    // } catch (e) {
    //   res.status(500).send();
    // }
  });
  
  router.get('/', async (req, res) => {
    try {
      const listRest = await moviesData.getTrending();
      res.status(200).json(listRest);
    } catch (e) {
      res.status(500).send();
    }
  });
  
  router.post('movies/', async (req, res) => {
      const moviesDataList = req.body;
      if (!moviesDataList.movie_name) {
        res.status(400).json({ error: 'You must provide Name of the Movie' });
        return;
      }
      if (!moviesDataList.director) {
        res.status(400).json({ error: 'You must provide the director name of the Movie' });
        return;
      }
      if (!moviesDataList.release_year) {
        res.status(400).json({ error: 'You must provide release year of the Movie' });
        return;
      }
      if (!moviesDataList.cast) {
          res.status(400).json({ error: 'You must provide cast of the Movie' });
          return;
        }
        if (!moviesDataList.genre) {
          res.status(400).json({ error: 'You must provide genre of the Movie' });
          return;
        }
        if (!moviesDataList.streaming_services) {
          res.status(400).json({ error: 'You must provide streaming services of the Movie' });
          return;
        }
        if (!moviesDataList.movie_img) {
          res.status(400).json({ error: 'You must provide poster/image of the Movie' });
          return;
        }
        
      try {
        const { movie_name, director, release_year, cast, streaming_services, genre, movie_img } = restDataList;
        const newMovie = await moviesData.createMovie(movie_name, director, release_year, cast, streaming_services,genre, movie_img);
        res.redirect('/movies/all');
      } catch (e) {
        res.status(500).json({ error: e });
      }
    });
    
    router.put('movies/:id', async (req, res) => {
      const updatedData = req.body; 
      if (!updatedData.movie_name || !updatedData.director || !updatedData.release_year || !updatedData.cast || !updatedData.genre ||
          !updatedData.streaming_services ) {
        res.status(400).json({ error: 'You must Supply All fields' });
        return;
      }
      try {
        await moviesData.get(req.params.id);
      } catch (e) {
        res.status(404).json({ error: 'Movie/TV Show not found' });
        return;
      }
    
      try {
        const { movie_name, director, release_year, cast, streaming_services, genre, movie_img } = updatedData;
        const updatedMovie = await moviesData.updatingMovie(req.params.id, movie_name, director, release_year, cast, streaming_services, genre, movie_img);
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