const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = require('../data/users');
const moviesData = data.movies;

router.get('/all', async (req, res) => {
	try {
		const listRest = await moviesData.getAllMovies();
		//console.log(req.session);
		res.render('movies/allMovies', {
			movieList: listRest,
			title: 'Characters Found',
		});
	} catch (e) {
		res.status(400).render('pages/error', { error: e, title: 'Search Error' });
	}
	//   res.status(200).json(listRest);
	// } catch (e) {
	//   res.status(500).send();
	// }
});

router.get('/all/:genre', async (req, res) => {
	try {
		const sorted = await moviesData.getByGenre(req.params.genre);
		//res.render('movies/allMovies',{movieList:sorted,title:'Characters Found'});
		return sorted;
		//res.render('movies/allMovies',{movieList:listRest,title:'Characters Found'});
	} catch (e) {
		//res.status(400).render('pages/error',{error:e, title:'Search Error'});
	}
	//   res.status(200).json(listRest);
	// } catch (e) {
	//   res.status(500).send();
	// }
});
router.get('/addMovie', async (req, res) => {
	if (req.session.user) {
		try {
			res.render('movies/newMovie', { title: 'Characters Found' });
		} catch (e) {
			res
				.status(400)
				.render('pages/error', { error: e, title: 'Search Error' });
		}
	} else {
		res.redirect('/');
	}
});

//TESTS ALPHABETICAL SORT
router.get('/alpha', async (req, res) => {
	try {
		const listRest = await moviesData.sortAlphabetically();
		res.status(200).json(listRest);
	} catch (e) {
		res.status(500).send();
	}
});

//TESTS GENRE FILTER
router.get('/genre', async (req, res) => {
	try {
		const listRest = await moviesData.getByGenre('comedy');
		res.status(200).json(listRest);
	} catch (e) {
		res.status(500).send();
	}
});

router.get('/:id', async (req, res) => {
	//console.log(req.params.id);
	//console.log(req.session);
	if (req.session.user) {
		try {
			const movie = await moviesData.getMovie(req.params.id);
			let rev = await usersData.getUser(req.session.user.username);

			// Getting details from session
			//console.log(movie);
			console.log(rev);

			res.render('movies/individualMovie', {
				movie: movie,
				title: 'Characters Found',
			});
		} catch (e) {
			res
				.status(400)
				.render('pages/error', { error: e, title: 'Search Error' });
		}
	} else {
		res.status(403).render('pages/error');
	}
});

//WIP!!!!!
router.get('/', async (req, res) => {
	try {
		const listRest = await moviesData.getTrending();
		res.status(200).render('movies/allMovies', {
			movieList: listRest,
			title: 'Characters Found',
		});
	} catch (e) {
		res.status(400).render('pages/error', { error: e, title: 'Search Error' });
	}
});

// router.get('/addMovie', async (req, res) => {
//   try {
//     res.render('movies/newMovies',{title:'Characters Found'});
//   } catch (e) {
//     res.status(400).render('pages/error',{error:e, title:'Search Error'});
//   }

// });

router.post('/addMovie', async (req, res) => {
	const moviesDataList = req.body;
	if (!moviesDataList.movie_name) {
		res.status(400).json({ error: 'You must provide Name of the Movie' });
		return;
	}
	if (!moviesDataList.director) {
		res
			.status(400)
			.json({ error: 'You must provide the director name of the Movie' });
		return;
	}
	if (!moviesDataList.release_year) {
		res
			.status(400)
			.json({ error: 'You must provide release year of the Movie' });
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
		res
			.status(400)
			.json({ error: 'You must provide streaming services of the Movie' });
		return;
	}
	if (!moviesDataList.movie_img) {
		res
			.status(400)
			.json({ error: 'You must provide poster/image of the Movie' });
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
		} = moviesDataList;
		console.log(moviesDataList);
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

router.put('/edit/:id', async (req, res) => {
	const updatedData = req.body;
	if (
		!updatedData.movie_name ||
		!updatedData.director ||
		!updatedData.release_year ||
		!updatedData.cast ||
		!updatedData.genre ||
		!updatedData.streaming_services
	) {
		res.status(400).json({ error: 'You must Supply All fields' });
		return;
	}
	try {
		await moviesData.getMovie(req.params.id);
	} catch (e) {
		res.status(404).json({ error: 'Movie/TV Show not found' });
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
