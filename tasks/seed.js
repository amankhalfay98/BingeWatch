const connection = require("../config/mongoConnection");
const dbFunctions = require("../data/index");

async function main() {
  try {
    const avengers = await dbFunctions.movies.createMovie(
      "akhalfay",
      "Avengers",
      "Joss Whedon",
      2012,
      ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
      {
        name: "Disney+",
        link: "https://www.disneyplus.com/movies/marvel-studios-the-avengers/2h6PcHFDbsPy",
      },
      ["action", "thriller"],
      "image"
    );
    console.log(avengers);
  } catch (e) {
    console.log(e);
  }
  try {
    const inception = await dbFunctions.movies.createMovie(
      "supersid",
      "Inception",
      "Christopher Nolan",
      2010,
      ["Leonardo DiCaprio", "Elliot Page", "Joseph Gordon-Levitt"],
      {
        name: "Hulu",
        link: "https://www.hulu.com/movie/inception-5519f425-9b21-48fb-8e67-aef24c76604a?entity_id=5519f425-9b21-48fb-8e67-aef24c76604a",
      },
      ["action", "science-fiction"],
      "image"
    );
    console.log(inception);
  } catch (e) {
    console.log(e);
  }
  try {
    const forrest = await dbFunctions.movies.createMovie(
      "jdelrosa",
      "Forrest Gump",
      "Robert Zemeckis",
      1994,
      ["Tom Hanks", "Robin Wright", "Gary Sinise"],
      {
        name: "YouTube",
        link: "https://www.youtube.com/watch?v=hf_lCA-T99c",
      },
      ["comedy", "drama"],
      "image"
    );
    console.log(forrest);
  } catch (e) {
    console.log(e);
  }
  // try {
  //   const user1 = await dbFunctions.users.createUser(
  //     "Roy Rogers",
  //     "1984-12-12",
  //     "royRoy",
  //     "123456yes",
  //     "royrogers@gmail.com"
  //   );
  //   console.log(user1);
  // } catch (e) {
  //   console.log(e);
  // }
  // try {
  //   const user2 = await dbFunctions.users.createUser(
  //     "Mary Shelley",
  //     "1959-01-12",
  //     "MaryLovely",
  //     "marylamb",
  //     "shelleylovely@yahoo.com"
  //   );
  //   console.log(user2);
  // } catch (e) {
  //   console.log(e);
  // }
  // try {
  //   const user3 = await dbFunctions.users.createUser(
  //     "Rich Jackson",
  //     "2000-07-19",
  //     "AllDaMoney",
  //     "gogogo",
  //     "richboi@hotmail.com"
  //   );
  //   console.log(user3);
  // } catch (e) {
  //   console.log(e);
  // }
  // try {
  //   const addFave = await dbFunctions.users.addToFave(
  //     "royroy",
  //     "Avengers"
  //   );
  //   console.log(addFave);
  // } catch (e) {
  //   console.log(e);
  // }
  // try {
  //   const addFollow = await dbFunctions.users.followUser(
  //     "royroy",
  //     "marylovely"
  //   );
  //   console.log(addFollow);
  // } catch (e) {
  //   console.log(e);
  // }
  // try {
  //   const watchMovie = await dbFunctions.movies.movieWatched(
  //     "royroy",
  //     "Avengers"
  //   );
  //   console.log(watchMovie);
  // } catch (e) {
  //   console.log(e);
  // }
  // try {
  //   const review1 = await dbFunctions.reviews.create(
  //     "61a6cc5f6e136e45be55b692",
  //     "supersid",
  //     "61ad788d59a8d9f0e4407f42",
  //     "Avengers",
  //     "Good Movie!",
  //     5
  //   );
  //   console.log(review1);
  // } catch (error) {
  //   console.log(error);
  // }

  const db = await connection.connectToDb();
  await connection.closeConnection();
  console.log("Done!");
}

main().catch((error) => {
  console.log(error);
});
